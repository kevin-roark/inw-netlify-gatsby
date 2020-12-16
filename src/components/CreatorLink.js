import React from 'react'

const CreatorLink = ({ creator, creatorurl, className }) => (
  <div className={className}>
    {creatorurl
      ? <a href={creatorurl} target="_blank" rel="noreferrer">{creator}</a>
      : creator}
  </div>
)

export default CreatorLink
