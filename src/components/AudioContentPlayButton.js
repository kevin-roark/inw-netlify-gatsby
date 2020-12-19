import React from 'react'
import { observer } from 'mobx-react'
import { audioManagerModel } from '../models/audioManager'

const AudioContentPlayButton = observer(({ model, data }) => {
  return data.frontmatter.audiourl ? (
    <div>
      <button onClick={() => model.setMarkdownAudioItem(data, true)}>
        Play
      </button>
    </div>
  ) : null
})

export default ({ data }) => (
  <AudioContentPlayButton model={audioManagerModel} data={data} />
)
