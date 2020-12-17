import React from 'react'
import { observer } from 'mobx-react'
import { Link, graphql, StaticQuery } from 'gatsby'
import { audioManagerModel } from '../models/audioManager'
import { formatTime } from '../util/format'
import CreatorLink from './CreatorLink'

import './audioManager.sass'

const CurrentAudioTimeUI = observer(({ model }) => {
  const { currentAudioItem, currentTime: time, isRadio: radio, duration, playing } = model
  if (!currentAudioItem || !playing) {
    return null
  }

  const progress = time / duration

  return (
    <div className="inw-player-current-audio-ui">
      <div className="inw-player-current-time">{formatTime(time)}</div>
      <div className="inw-player-duration">{radio ? '' : formatTime(duration)}</div>
      <div className="inw-player-progress-bar-base inw-player-progress-bar-bg" />
      {!radio && (
        <div
          className="inw-player-progress-bar-base inw-player-progress-bar"
          style={{
            // transform: `scaleX(${progress})`,
            width: `${progress * 100}%`
          }}
        />
      )}
    </div>
  )
})

const CurrentAudioInfo = observer(({ model }) => {
  const { currentAudioItem, isRadio } = model
  if (!currentAudioItem) {
    return null
  }

  const wrapInLink = (content, link = currentAudioItem.slug) =>
    isRadio || !link ? content : <Link to={link}>{content}</Link>

  return (
    <div className="inw-player-current-item-container">
      <div className="inw-player-current-item-meta">
        <div className="inw-player-current-item-text">
          <span className="inw-player-current-item-type">{currentAudioItem.type}</span>
          {' — '}
          <span className="inw-player-current-item-title">
            {wrapInLink(currentAudioItem.title)}
          </span>
        </div>

        {currentAudioItem.mainimage && wrapInLink(
          <img className="inw-player-current-item-image" src={currentAudioItem.mainimage} alt="" />
        )}

        {currentAudioItem.creator && (
          <CreatorLink className="inw-player-current-item-creator" {...currentAudioItem} />
        )}
      </div>

      <CurrentAudioTimeUI model={model} />
    </div>
  )
})

const RadioIndicator = observer(({ model }) => {
  const { radioAvailable, radioMetadata: md } = model
  return (
    <div className={`inw-player-radio-live-container ${radioAvailable ? 'online' : 'offline'}`}>
      <div className="inw-player-radio-live-title">
        {radioAvailable ? `Radio live${md && md.name ? ` — ${md.name}` : ''}` : 'No Radio'}
      </div>
      <div className="inw-player-radio-live-dot"></div>
    </div>
  )
})

class _AudioManager extends React.Component {
  audioRef = React.createRef()

  componentDidMount() {
    const { model, data } = this.props

    if (model && data) {
      const config = data.configs.edges[0].node.frontmatter
      const audioItems = data.audioItems.edges.map(e => e.node).filter(n => !!n.frontmatter.audiourl)
      model.setupFromMount({
        config: config,
        markdownAudioItems: audioItems,
        audioEl: this.audioRef.current
      })
    }
  }

  componentWillUnmount() {
    this.props.model.handleUnmount()
  }

  render() {
    const { model } = this.props

    return (
      <div className="inw-player-container">
        {model.loading && <div className="inw-loading">Loading...</div>}

        <CurrentAudioInfo model={model} />

        <button
          className="inw-player-play-btn"
          onClick={model.onPlayClick}
        >
          {model.playing ? 'Pause' : 'Play'}
        </button>

        <RadioIndicator model={model} />

        <audio
          id="inw-player-audio"
          ref={this.audioRef}
        />
      </div>
    )
  }
}

const AudioManager = observer(_AudioManager)

export default () => (
  <StaticQuery
    query={graphql`
      query AudioManagerQuery {
        audioItems: allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { in: ["mix", "radio-archive"] } } }
        ) {
          edges {
            node {
              fields { slug }
              frontmatter {
                title
                templateKey
                date(formatString: "MM/DD/YYYY")
                mainimage
                creator
                creatorurl
                audiourl
              }
            }
          }
        }

        configs: allMarkdownRemark(filter: { frontmatter: { title: { eq: "Main Config" } } }) {
         	edges {
            node {
              frontmatter {
                radioHomeUrl
                radioStreamUrl
              }
            }
          }
        }
      }
    `}
    render={(data) => <AudioManager data={data} model={audioManagerModel} />}
  />
)
