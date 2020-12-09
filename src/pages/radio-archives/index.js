import React from 'react'

import Layout from '../../components/Layout'
import RadioArchiveRoll from '../../components/RadioArchiveRoll'

export default class MixesIndexPage extends React.Component {
  render() {
    return (
      <Layout>
        <div>
          <h1
            className="has-text-weight-bold is-size-1"
            style={{
              boxShadow: '0.5rem 0 0 #f40, -0.5rem 0 0 #f40',
              padding: '1rem',
            }}
          >
            Infinite New World Radio Archives
          </h1>
        </div>

        <section className="section">
          <div className="container">
            <div className="content">
              <RadioArchiveRoll />
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}
