import React from 'react'
import PropTypes from 'prop-types'
import { RadioArchiveTemplate } from '../../templates/radio-archive'

const RadioArchivePreview = ({ entry, widgetFor }) => {
  const tags = entry.getIn(['data', 'tags'])
  return (
    <RadioArchiveTemplate
      data={{
        html: widgetFor('body'),
        fields: { slug: entry.getIn(['data', 'slug']) },
        frontmatter: {
          title: entry.getIn(['data', 'title']),
          description: entry.getIn(['data', 'description']),
          mainimage: entry.getIn(['data', 'mainimage']),
          creator: entry.getIn(['data', 'creator']),
          creatorurl: entry.getIn(['data', 'creatorurl']),
          date: entry.getIn(['data', 'date']),
          tags: tags && tags.toJS(),
        },
      }}
    />
  )
}

RadioArchivePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default RadioArchivePreview
