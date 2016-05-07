import React from 'react'
import Component from 'react-pure-render/component'
import classNames from 'classnames'
import './RoundBadge.scss'


export default class RoundBadge extends Component {
  render() {
    const {size = 1} = this.props
    const className = size === 2
      ? classNames('RoundBadge x2', this.props.className)
      : classNames('RoundBadge', this.props.className)

    return (
      <div className={className}>
        {this.props.children}
      </div>
    )
  }
}
