import React from 'react'
import PropTypes from 'prop-types'
import { MixTemplate } from '../../templates/mix'

const MixPreview = ({ entry, widgetFor }) => {
  const tags = entry.getIn(['data', 'tags'])
  return (
    <MixTemplate
      data={{
        html: widgetFor('body'),
        fields: { slug: entry.getIn(['data', 'slug']) },
        frontmatter: {
          title: entry.getIn(['data', 'title']),
          description: entry.getIn(['data', 'description']),
          mainimage: entry.getIn(['data', 'mainimage']),
          creator: entry.getIn(['data', 'creator']),
          creatorurl: entry.getIn(['data', 'creatorurl']),
          date: String(entry.getIn(['data', 'date'])),
          tags: tags && tags.toJS(),
        },
      }}
    />
  )
}

MixPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default MixPreview
