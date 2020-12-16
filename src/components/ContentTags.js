import React from 'react'
import { kebabCase } from 'lodash'
import { Link } from 'gatsby'

const ContentTags = ({ tags, className }) => {
  return tags && tags.length ? (
    <div className={className} style={{ marginTop: `4rem` }}>
      <h4>Tags</h4>
      <ul className="taglist">
        {tags.map((tag) => (
          <li key={tag + `tag`}>
            <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
          </li>
        ))}
      </ul>
    </div>
  ) : null
}

export default ContentTags
