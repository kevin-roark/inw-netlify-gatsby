const zpad = (n, len = 2) => {
  let ns = n + ''
  while (ns.length < len) {
    ns = '0' + ns
  }
  return ns
}

export const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds - h * 3600) / 60)
  const s = Math.round(seconds - h * 3600 - m * 60)
  return `${h > 0 ? `${zpad(h)}:` : ''}${zpad(m)}:${zpad(s)}`
}

export const getAudioTypeName = (audioType) => {
  switch (audioType) {
    case 'mix':
      return 'Mix'
    case 'radio-archive':
      return 'Radio Archive'
    default:
      return audioType
  }
}
