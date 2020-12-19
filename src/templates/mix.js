import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import { setCurrentAudioItemEffect } from '../util/effects'
import Layout from '../components/Layout'
import MixContent, { MixContentDataShape } from '../components/MixContent'

export const MixTemplate = ({ data, helmet }) => {
  return (
    <section className="section">
      {helmet || ''}

      <div className="container content">
        <div className="columns">
          <MixContent data={data} className="column is-10 is-offset-1" />
        </div>
      </div>
    </section>
  )
}

MixTemplate.propTypes = {
  data: MixContentDataShape,
  helmet: PropTypes.object,
}

const Mix = ({ data }) => {
  const { markdownRemark: post } = data

  useEffect(() => setCurrentAudioItemEffect(post))

  return (
    <Layout>
      <MixTemplate
        data={post}
        helmet={
          <Helmet titleTemplate="%s | Blog">
            <title>{`Mix | ${post.frontmatter.title}`}</title>
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

Mix.propTypes = {
  data: PropTypes.shape({
    markdownRemark: MixContentDataShape,
  }),
}

export default Mix

export const pageQuery = graphql`
  query MixByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        slug
      }
      ...MixContentFrontmatterFragment
    }
  }
`
