import React from 'react'
import PropTypes from 'prop-types'
import Component from 'react-pure-render/component'
import classnames from 'classnames'
import './TopNavbar.scss'
import { IndexLink, Link as ReactdRouterLink } from 'react-router'
import Logo from './Logo.jsx'
import HeadwayChangelog from './HeadwayChangelog.jsx'

const StaticLink = ({to, children, className}) => (
  <a href={to} className={className}>{children}</a>
)

const getLinkComponent = useStaticLinks => (
  useStaticLinks
    ? StaticLink
    : ReactdRouterLink
)

export default class TopNavbar extends Component {
  render() {

    const { useStaticLinks = false } = this.props

    const Link = getLinkComponent(useStaticLinks)

    const classNames = classnames('TopNavbar', 'navbar bg-faded') //'navbar-fixed-top'
    return (
      <nav className={classNames}>
        <div className="content">
          <div className="content-left">
            <IndexLink className="navbar-logo" to={'/'}>
              <Logo /><div className="navbar-brand-description">RCN</div>
            </IndexLink>
            <HeadwayChangelog />
          </div>
          <div className="content-right">
            <ul className="nav navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" activeClassName="nav-link-active" to={'/calendars/usac-2017'}>USAC 2017</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" activeClassName="nav-link-active" to={'/calendars/ncnca-2017'}>NCNCA 2017</Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link" activeClassName="nav-link-active" to={'/calendars/ncnca-2016'}>NCNCA 2016</Link>
              </li> */}
              {/* <li className="nav-item">
                <Link className="nav-link" activeClassName="nav-link-active" to={'/calendars/norcal-mtb'}>MTB 2016</Link>
              </li> */}
              {__ENV.Dev && ([ //eslint-disable-line
                <li className="nav-item" key={3}>
                  <Link className="nav-link faded" activeClassName="nav-link-active"
                    to={'/calendars/ncnca-2017-draft'}>NCNCA Draft</Link>
                </li>,
                <li className="nav-item" key={2}>
                  <Link className="nav-link faded" activeClassName="nav-link-active" to={'/dev'}>Dev</Link>
                </li>,
              ])}
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

TopNavbar.propTypes = {
  // it may not be directly used but is required so pureRenderMixing re-renders component when
  // location changes (passed from react-router)
  location: PropTypes.object.isRequired,
  // turns links into static onese and not routed via react-router
  // this is helpful when we use "sub-apps" that use their own react router like /admin
  useStaticLinks: PropTypes.bool,
}
