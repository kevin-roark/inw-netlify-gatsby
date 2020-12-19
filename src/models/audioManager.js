import { makeAutoObservable, runInAction } from 'mobx'
import { getAudioTypeName } from '../util/format'

// HpnNV7hjv2C95uvBE55HuKBUOQGzNDQM

const radioMetadataUpdateInterval = 30 * 1000

export class AudioManagerModel {
  constructor() {
    makeAutoObservable(this)
  }

  /// Data

  loading = false
  radioAvailable = false
  radioMetadata = null // null or { name, description }
  hasSetup = false

  config = null
  markdownAudioItems = [] // graphql mix or radio-archive nodes

  audioEl = null
  currentAudioItem = null // null or { type, title, src } data

  playing = false
  currentTime = 0
  duration = 0

  get isRadio() {
    return !!this.currentAudioItem && this.currentAudioItem.type === 'Radio'
  }

  /// Actions

  async setupFromMount({ config, markdownAudioItems, audioEl }) {
    this.mounted = true

    if (this.hasSetup) {
      if (this.audioEl && this.wasPlayingBeforeUnmount) {
        setTimeout(() => {
          this.audioEl.play()
        }, 0)
      }
      return
    }

    this.config = config
    this.audioEl = audioEl
    this.markdownAudioItems = markdownAudioItems || []
    this.hasSetup = true

    this.loading = true
    await Promise.all([this.updateRadioAvailable(), this.updateRadioMetadata()])

    runInAction(() => {
      this.loading = false

      setTimeout(
        this.updateRadioAvailableAndMetadataLoop,
        radioMetadataUpdateInterval
      )
      this.updateAudioLoop()
    })
  }

  handleUnmount() {
    this.mounted = false
    this.wasPlayingBeforeUnmount = this.playing
  }

  setCurrentAudioItem(item) {
    this.currentAudioItem = item

    if (!item) {
      this.updateAudioElForNoAudio()
    }
  }

  chooseInitialAudioItem() {
    if (this.radioAvailable) {
      return this.setCurrentAudioItem(this.getRadioAudioPlayerData())
    }

    // choose randomly from available media
    const possibleItems = this.markdownAudioItems
    if (possibleItems.length === 0) {
      return
    }

    const item = possibleItems[Math.floor(Math.random() * possibleItems.length)]
    this.setCurrentAudioItem(this.getMarkdownItemAudioPlayerData(item))
  }

  playCurrentAudioItem() {
    if (!this.currentAudioItem || !this.audioEl) {
      return
    }

    if (this.audioEl.src !== this.currentAudioItem.src) {
      this.audioEl.src = this.currentAudioItem.src
      this.audioEl.currentTime = 0
    }

    const prom = this.audioEl.play()
    if (prom) {
      prom.catch((err) => {
        console.log(err)
      })
    }
  }

  setMarkdownAudioItem(node, autoplay) {
    this.setCurrentAudioItem(this.getMarkdownItemAudioPlayerData(node))

    if (autoplay) {
      this.playCurrentAudioItem()
    }
  }

  updateAudioElForNoAudio() {
    if (this.audioEl) {
      if (!this.audioEl.paused) {
        this.audioEl.pause()
      }
      this.audioEl.currentTime = 0
    }
  }

  setAudioProgress(progress) {
    if (
      isNaN(progress) ||
      !this.audioEl ||
      this.isRadio ||
      !this.currentAudioItem ||
      !this.audioEl.duration
    ) {
      return
    }

    this.audioEl.currentTime = progress * this.audioEl.duration
  }

  /// Event Handlers

  onPlayClick = () => {
    if (this.playing) {
      this.audioEl.pause()
    } else {
      if (!this.currentAudioItem) {
        this.chooseInitialAudioItem()
      }

      this.playCurrentAudioItem()
    }
  }

  /// Audio Player Data

  updateAudioDataFromAudioEl() {
    if (!this.audioEl || !this.mounted) {
      return
    }

    this.playing = !this.audioEl.paused
    this.currentTime = this.audioEl.currentTime || 0
    this.duration = this.audioEl.duration || 0
  }

  updateAudioLoop = () => {
    this.updateAudioDataFromAudioEl()
    requestAnimationFrame(this.updateAudioLoop)
  }

  getRadioAudioPlayerData = () => {
    const md = this.radioMetadata
    return {
      type: 'Radio',
      title: md
        ? `${md.name}${md.description ? ` - ${md.description}` : ''}`
        : '',
      src: this.config.radioStreamUrl,
    }
  }

  getMarkdownItemAudioPlayerData = (n) => ({
    ...n.frontmatter,
    type: getAudioTypeName(n.frontmatter.templateKey),
    slug: n.fields.slug,
    src: n.frontmatter.audiourl,
  })

  /// Loading Radio Data

  getRadioAvailable = () =>
    fetch(this.config.radioStreamUrl)
      .then((res) => res.status === 200)
      .catch((err) => {
        console.log(err)
        return false
      })

  updateRadioAvailable = () =>
    this.getRadioAvailable().then((avail) => {
      runInAction(() => {
        this.radioAvailable = !!avail
      })
    })

  updateRadioMetadata = () =>
    this.scrapeIcecastHomepageForRadioMetadata(this.config).then((metadata) => {
      runInAction(() => {
        this.radioMetadata = metadata

        if (this.isRadio) {
          if (metadata) {
            this.currentAudioItem.title = this.getRadioAudioPlayerData().tiltle
          } else {
            this.setCurrentAudioItem(null)
          }
        }
      })
    })

  updateRadioAvailableAndMetadataLoop = () => {
    try {
      this.updateRadioAvailable()
      this.updateRadioMetadata()
    } catch (err) {
      console.log(err)
    }

    setTimeout(
      this.updateRadioAvailableAndMetadataLoop,
      radioMetadataUpdateInterval
    )
  }

  scrapeIcecastHomepageForRadioMetadata(config) {
    return fetch(config.radioHomeUrl)
      .then((response) => response.text())
      .then((text) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'text/html')
        const tableRows = doc.querySelectorAll('.mountcont tbody tr')

        let streamName = null,
          streamDescription = null
        tableRows.forEach((r) => {
          const tds = r.querySelectorAll('td')
          const title = tds[0].innerText
          const data = tds[1].innerText
          if (title === 'Stream Name:') {
            streamName = data
          } else if (title === 'Stream Description:') {
            streamDescription = data
          }
        })

        return { name: streamName, description: streamDescription }
      })
      .catch((err) => {
        console.log('err scraping icecast homepage', err)
        return null
      })
  }
}

export const audioManagerModel = new AudioManagerModel()
