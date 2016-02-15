import React from 'react'
import Component from 'react-pure-render/component'
import classnames from 'classnames'
import './TopNavbar.scss'
import {Link} from 'react-router'

export default class TopNavbar extends Component {
  render() {
    const classNames = classnames('TopNavbar', 'navbar  bg-faded')
    return (
      <nav className={classNames}>
        <div className="content">
          <div className="content-left">
            <a className="navbar-brand" href="#">RCN</a>
            <div className="navbar-brand-description">Plan your season</div>
          </div>
          <div className="content-right">
            <ul className="nav navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to={'/cal'}>Cal</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link faded" to={'/dev'}>Dev</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
