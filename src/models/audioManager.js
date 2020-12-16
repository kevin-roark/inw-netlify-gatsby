import { makeAutoObservable, runInAction } from 'mobx'

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

  config = null
  availableAudioItems = [] // graphql mix or radio-archive nodes

  audioEl = null
  currentAudioItem = null // null or { type, title, src } data

  playing = false
  currentTime = 0
  duration = 0

  get isRadio() {
    return !!this.currentAudioItem && this.currentAudioItem.type === 'Radio'
  }

  /// Actions

  async setupFromMount({ config, audioItems, audioEl }) {
    this.config = config
    this.audioEl = audioEl
    this.availableAudioItems = audioItems || []

    this.loading = true
    await Promise.all([
      this.updateRadioAvailable(),
      this.updateRadioMetadata(),
    ])

    runInAction(() => {
      this.loading = false

      setTimeout(this.updateRadioAvailableAndMetadataLoop, radioMetadataUpdateInterval)
      this.updateAudioLoop()
    })
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
    const possibleItems = this.availableAudioItems
    if (possibleItems.length === 0) {
      return
    }

    const item = possibleItems[Math.floor(Math.random() * possibleItems.length)]
    this.setCurrentAudioItem(this.getAudioItemAudioPlayerData(item))
  }

  playCurrentAudioItem() {
    if (!this.currentAudioItem || !this.audioEl) {
      return
    }

    // if (this.audioEl.src != this.currentAudioItem.src) {
    //   this.audioEl.src = this.currentAudioItem.src
    // }

    this.audioEl.currentTime = 0
    this.audioEl.play()
  }

  setAndPlayAudioItem(item) {
    this.setCurrentAudioItem(item)
    this.playCurrentAudioItem(item)
  }

  updateAudioElForNoAudio() {
    if (this.audioEl) {

    }
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
    if (!this.audioEl) {
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
      title: md ? `${md.name}${md.description ? ` - ${md.description}` : ''}` : '',
      src: this.config.radioStreamUrl,
    }
  }

  getAudioItemAudioPlayerData = (item) => ({
    type: item.type,
    title: item.name,
    src: item.audiourl,
  })

  /// Loading Radio Data

  getRadioAvailable = () => fetch(this.config.radioStreamUrl)
    .then(res => res.status === 200)
    .catch(err => {
      console.log(err)
      return false
    })

  updateRadioAvailable = () => this.getRadioAvailable().then(avail => {
    runInAction(() => {
      this.radioAvailable = !!avail
    })
  })

  updateRadioMetadata = () => this.scrapeIcecastHomepageForRadioMetadata(this.config).then(metadata => {
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

    setTimeout(this.updateRadioAvailableAndMetadataLoop, radioMetadataUpdateInterval)
  }

  scrapeIcecastHomepageForRadioMetadata(config) {
    return fetch(config.radioHomeUrl)
      .then(response => response.text())
      .then(text => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'text/html')
        const tableRows = doc.querySelectorAll('.mountcont tbody tr')

        let streamName = null, streamDescription = null
        tableRows.forEach(r => {
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
      .catch(err => {
        console.log('err scraping icecast homepage', err)
        return null
      })
  }
}

export const audioManagerModel = new AudioManagerModel()
