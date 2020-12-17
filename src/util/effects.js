import { audioManagerModel } from '../models/audioManager'

export const setCurrentAudioItemEffect = (markdownAudioItem) => {
  if (markdownAudioItem && !audioManagerModel.currentAudioItem) {
    audioManagerModel.setMarkdownAudioItem(markdownAudioItem)
  }
}
