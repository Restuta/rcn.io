import React from 'react'
import Component from 'react-pure-render/component'
import classNames from 'classnames'
import './Badge.scss'


export default class Badge extends Component {
  render() {
    const className = classNames('Badge', this.props.className)

    return (
      <span className={className}>
        {this.props.children}
      </span>
    )
  }
}
