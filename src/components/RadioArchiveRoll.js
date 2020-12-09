import React from 'react'
import PropTypes from 'prop-types'
import { graphql, StaticQuery } from 'gatsby'
import RadioArchiveContent from './RadioArchiveContent'

class RadioArchiveRoll extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <div className="columns is-multiline">
        {posts &&
          posts.map(({ node }) => (
            <div className="is-parent column is-6" key={node.id}>
              <RadioArchiveContent
                data={node}
                className={`blog-list-item tile is-child box notification`}
              />
            </div>
          ))}
      </div>
    )
  }
}

RadioArchiveRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query RadioArchiveRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "radio-archive" } } }
        ) {
          edges {
            node {
              id
              html
              fields {
                slug
              }
              frontmatter {
                title
                templateKey
                date(formatString: "MM/DD/YYYY")
                mainimage
                creator
                creatorurl
                tags
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <RadioArchiveRoll data={data} count={count} />}
  />
)
