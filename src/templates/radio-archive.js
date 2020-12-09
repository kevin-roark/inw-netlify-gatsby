import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import RadioArchiveContent, { RadioArchiveContentDataShape } from '../components/RadioArchiveContent'

export const RadioArchiveTemplate = ({ data, helmet }) => {
  return (
    <section className="section">
      {helmet || ''}

      <div className="container content">
        <div className="columns">
          <RadioArchiveContent
            data={data}
            className="column is-10 is-offset-1"
          />
        </div>
      </div>
    </section>
  )
}

RadioArchiveTemplate.propTypes = {
  data: RadioArchiveContentDataShape,
  helmet: PropTypes.object,
}

const RadioArchive = ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <Layout>
      <RadioArchiveTemplate
        data={post}
        helmet={
          <Helmet titleTemplate="%s | Blog">
            <title>{`Radio Archive | ${post.frontmatter.title}`}</title>
            <meta
              name="description"
              content={`${post.frontmatter.description}`}
            />
          </Helmet>
        }
      />
    </Layout>
  )
}

RadioArchive.propTypes = {
  data: PropTypes.shape({
    markdownRemark: RadioArchiveContentDataShape,
  }),
}

export default RadioArchive

export const pageQuery = graphql`
  query RadioArchiveByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        title
        description
        date(formatString: "MM/DD/YYYY")
        mainimage
        creator
        creatorurl
        description
        tags
      }
    }
  }
`
