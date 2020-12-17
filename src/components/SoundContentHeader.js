import React from 'react'
import { Link } from 'gatsby'
import PreviewCompatibleImage from './PreviewCompatibleImage'
import AudioContentPlayButton from './AudioContentPlayButton'
import CreatorLink from './CreatorLink'

const SoundContentHeader = ({ data }) => {
  const { title, mainimage, date, creator, creatorurl } = data.frontmatter
  return (
    <header>
      {mainimage ? (
        <div className="featured-thumbnail">
          <PreviewCompatibleImage
            imageInfo={{
              image: mainimage,
              alt: `thumbnail for mix ${title}`,
            }}
          />
        </div>
      ) : null}

      <div className="post-meta">
        <Link
          className="title has-text-primary is-size-4"
          to={data.fields.slug}
        >
          {title}
        </Link>
        <span className="subtitle is-size-5 is-block">
          <div>{date}</div>
          <CreatorLink creator={creator} creatorurl={creatorurl} />
        </span>
      </div>

      <AudioContentPlayButton data={data} />
    </header>
  )
}

export default SoundContentHeader
