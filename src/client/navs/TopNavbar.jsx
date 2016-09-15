import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import classnames from 'classnames'
import './TopNavbar.scss'
import {IndexLink, Link} from 'react-router'
import Logo from './Logo.jsx'
import HeadwayChangelog from './HeadwayChangelog.jsx'

export default class TopNavbar extends Component {
  render() {
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
                <Link className="nav-link" activeClassName="nav-link-active" to={'/calendars/ncnca-2016'}>NCNCA 2016</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" activeClassName="nav-link-active" to={'/calendars/norcal-mtb'}>MTB</Link>
              </li>
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
  //it may not be directly used but is required so pureRenderMixing re-renders component when
  //location changes (passed from react-router)
  location: PropTypes.object.isRequired
}
