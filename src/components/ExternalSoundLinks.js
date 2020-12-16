import React from 'react'

const ExternalSoundLinks = ({ soundcloudurl, applemusicurl, spotifyurl, className }) => {
  const urls = [
    { label: 'Soundcloud', url: soundcloudurl },
    { label: 'Apple Music', url: applemusicurl },
    { label: 'Spotify', url: spotifyurl },
  ].filter(item => !!item.url)

  return urls.length ? (
    <div className={`flex-center ${className || ''}`}>
      {urls.map(({ label, url }) => (
        <a key={label} href={url} target="_blank" rel="noreferrer" style={{ margin: 4 }}>
          {label}
        </a>
      ))}
    </div>
  ) : null
}

export default ExternalSoundLinks
