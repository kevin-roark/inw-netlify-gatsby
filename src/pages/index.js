import React from 'react'

import Layout from '../components/Layout'
import MixRoll from '../components/MixRoll'
import RadioArchiveRoll from '../components/RadioArchiveRoll'

export const IndexPageTemplate = () => (
  <div>
    <section className="section section--gradient">
      <div className="container">
        <div className="section">
          <div className="columns">
            <div className="column is-10 is-offset-1">
              <div className="content">
                <div className="column is-12">
                  <h3 className="has-text-weight-semibold is-size-2">
                    Latest Mixes
                  </h3>
                  <MixRoll />
                </div>
              </div>
            </div>
          </div>

          <div className="columns">
            <div className="column is-10 is-offset-1">
              <div className="content">
                <div className="column is-12">
                  <h3 className="has-text-weight-semibold is-size-2">
                    Latest Radio Archives
                  </h3>
                  <RadioArchiveRoll />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
)

const IndexPage = () => (
  <Layout>
    <IndexPageTemplate />
  </Layout>
)

export default IndexPage
