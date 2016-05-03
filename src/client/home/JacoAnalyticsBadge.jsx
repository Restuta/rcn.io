import React from 'react'
import Component from 'react-pure-render/component'
import classnames from 'classnames'
//import './JacoAnalyticsBadge.scss'

export default class JacoAnalyticsBadge extends Component {
  render() {
    const classNames = classnames('JacoAnalyticsBadge', this.props.className)

    return (
      <div className={classNames}>
        <a href='//getjaco.com' rel='nofollow' target='_blank'>
          <img src='//www.getjaco.com/images/free_with_logo/jaco-badge-white.png' alt='Jaco Analytics' />
        </a>
      </div>
    )
  }
}
