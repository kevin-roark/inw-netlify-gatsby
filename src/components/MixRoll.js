import React from 'react'
import PropTypes from 'prop-types'
import { graphql, StaticQuery } from 'gatsby'
import MixContent from './MixContent'

class MixRoll extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <div className="columns is-multiline">
        {posts &&
          posts.map(({ node }) => (
            <div className="is-parent column is-6" key={node.id}>
              <MixContent
                data={node}
                className={`blog-list-item tile is-child box notification`}
              />
            </div>
          ))}
      </div>
    )
  }
}

MixRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query MixRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "mix" } } }
        ) {
          edges {
            node {
              id
              html
              fields { slug }
              ...MixContentFrontmatterFragment
            }
          }
        }
      }
    `}
    render={(data, count) => <MixRoll data={data} count={count} />}
  />
)
