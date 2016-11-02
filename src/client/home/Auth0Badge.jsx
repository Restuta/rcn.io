import React from 'react'
import Component from 'react-pure-render/component'
import classnames from 'classnames'
import './Auth0Badge.scss'

export default class Auth0Badge extends Component {
  render() {
    const classNames = classnames('Auth0Badge', this.props.className)

    return (
      <div className={classNames}>
        <a width="150" height="50" href="https://auth0.com/"
          rel="nofollow" target="_blank" alt="Single Sign On & Token Based Authentication - Auth0">
          <img width="150" height="50" alt="JWT Auth for open source projects"
            src="//cdn.auth0.com/oss/badges/a0-badge-light.png"/>
        </a>
      </div>
    )
  }
}
