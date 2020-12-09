import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'
import logo from '../img/inw-logo.png'
import { navBarLinks } from './Navbar'

const Footer = class extends React.Component {
  render() {
    const { edges } = this.props.data.allMarkdownRemark
    const nodes = edges.map(e => e.node)

    const main = nodes.find(n => n.frontmatter.title === 'Main Config')
    const contact = nodes.find(n => n.frontmatter.title === 'Contact')

    return (
      <footer className="footer">
        <div className="content has-text-centered">
          <img
            src={logo}
            alt="Infinite New World"
            style={{ width: '300px' }}
          />
        </div>

        <div className="content has-text-centered">
          <div className="container">
            <div style={{ maxWidth: '100vw' }} className="columns">
              <div className="column is-3">
                <section className="menu">
                  <ul className="menu-list">
                    {navBarLinks.map(item => (
                      <li key={item.url}>
                        <Link to={item.url} className="navbar-item">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="column is-3">
                <h4>Info</h4>
                <p dangerouslySetInnerHTML={{ __html: main.html }} />
              </div>

              <div className="column is-3">
                <h4>Contact</h4>
                <p dangerouslySetInnerHTML={{ __html: contact.html }} />
              </div>

              <div className="column is-3">
                <h4>Follow</h4>
                <ul className="menu-list">
                  {main.frontmatter.urls.map(item => (
                    <li key={item.url}>
                      <Link to={item.url} className="navbar-item">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}

Footer.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query FooterQuery {
        allMarkdownRemark(
          filter: { frontmatter: { title: { in: ["Main Config", "Contact"] } } }
        ) {
          edges {
            node {
              html
              frontmatter {
                title
                urls { label, url }
              }
            }
          }
        }
      }
    `}
    render={(data) => <Footer data={data} />}
  />
)
