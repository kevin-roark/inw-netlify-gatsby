import React from 'react'
import { observer } from 'mobx-react'
import { audioManagerModel } from '../models/audioManager'

const AudioContentPlayButton = observer(({ model, data }) => {
  return data.audiourl ? (
    <div>
      <button
        onClick={() => model.setAndPlayAudioItem(data)}
      >
        Play
      </button>
    </div>
  ) : null
})

export default ({ data }) => (
  <AudioContentPlayButton
    model={audioManagerModel}
    data={data}
  />
)
