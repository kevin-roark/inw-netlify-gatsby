import React from 'react'
import PropTypes from 'prop-types'
import SoundContentHeader from './SoundContentHeader'
import ExternalSoundLinks from './ExternalSoundLinks'
import ContentTags from './ContentTags'

const RadioArchiveContent = ({ data, className }) => {
  const { description, tags } = data.frontmatter
  return (
    <article className={className}>
      <SoundContentHeader {...data} />

      {description && <p>{description}</p>}

      <div dangerouslySetInnerHTML={{ __html: data.html }} />

      <ExternalSoundLinks {...data.frontmatter} />

      <ContentTags tags={tags} />
    </article>
  )
}

export const query = graphql`
  fragment RadioArchiveContentFrontmatterFragment on MarkdownRemark {
    frontmatter {
      title
      templateKey
      date(formatString: "MM/DD/YYYY")
      mainimage
      creator
      creatorurl
      tags
      audiourl
      soundcloudurl
      spotifyurl
      applemusicurl
    }
  }
`

export const RadioArchiveContentDataShape = PropTypes.shape({
  html: PropTypes.string,
  fields: PropTypes.object,
  frontmatter: PropTypes.shape({
    title: PropTypes.string,
    templateKey: PropTypes.string,
    description: PropTypes.string,
    date: PropTypes.string,
    mainimage: PropTypes.string,
    creator: PropTypes.string,
    creatorurl: PropTypes.string,
    tags: PropTypes.array,
  })
})

RadioArchiveContent.propTypes = {
  data: RadioArchiveContentDataShape
}

export default RadioArchiveContent
