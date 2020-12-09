import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import { Link } from 'gatsby'
import PreviewCompatibleImage from './PreviewCompatibleImage'

const RadioArchiveContent = ({ data, className }) => {
  const { title, description, mainimage, date, creator, creatorurl, tags } = data.frontmatter
  return (
    <article className={className}>
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

        <p className="post-meta">
          <Link
            className="title has-text-primary is-size-4"
            to={data.fields.slug}
          >
            {title}
          </Link>
          <span className="subtitle is-size-5 is-block">
            <div>{date}</div>
            <div>
              {creatorurl ? (
                <a href={creatorurl} target="_blank">
                  {creator}
                </a>
              ) : creator}
            </div>
          </span>
        </p>
      </header>

      {description && <p>{description}</p>}

      <p dangerouslySetInnerHTML={{ __html: data.html }} />

      {tags && tags.length ? (
        <div style={{ marginTop: `4rem` }}>
          <h4>Tags</h4>
          <ul className="taglist">
            {tags.map((tag) => (
              <li key={tag + `tag`}>
                <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  )
}

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
