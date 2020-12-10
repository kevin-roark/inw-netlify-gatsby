import React from 'react'
import { Link } from 'gatsby'
import logo from '../img/inw-logo.png'

export const navBarLinks = [
  { label: 'Home', url: '/' },
  { label: 'Mixes', url: '/mixes' },
  { label: 'Radio Archives', url: '/radio-archives' },
  { label: 'About', url: '/about' },
]

const Navbar = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      navBarActiveClass: '',
    }
  }

  toggleHamburger = () => {
    // toggle the active boolean in the state
    this.setState(
      {
        active: !this.state.active,
      },
      // after state has been updated,
      () => {
        // set the class in state for the navbar accordingly
        this.state.active
          ? this.setState({
              navBarActiveClass: 'is-active',
            })
          : this.setState({
              navBarActiveClass: '',
            })
      }
    )
  }

  render() {
    const pathname = typeof window !== 'undefined' && window.location && window.location.pathname
    return (
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main-navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item" title="Logo">
              <img src={logo} alt="Infinite New World" style={{ width: '280px', maxHeight: 'none' }} />
            </Link>
            {/* Hamburger menu */}
            <div
              className={`navbar-burger burger ${this.state.navBarActiveClass}`}
              data-target="navMenu"
              onClick={() => this.toggleHamburger()}
            >
              <span />
              <span />
              <span />
            </div>
          </div>
          <div
            id="navMenu"
            className={`navbar-menu ${this.state.navBarActiveClass}`}
          >
            <div className="navbar-start has-text-centered">
              {navBarLinks.map(item => (
                <Link
                  key={item.url}
                  className={`navbar-item ${item.url === pathname ? 'current' : ''}`}
                  to={item.url}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar
