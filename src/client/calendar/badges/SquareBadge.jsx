import React from 'react'
import Component from 'react-pure-render/component'
import classNames from 'classnames'
import './Badge.scss'


export default class SquareBadge extends Component {
  render() {
    const className = classNames('Badge', this.props.className)
    const style = {
      borderRadius: '2px'
    }

    return (
      <span style={style} className={className}>
        {this.props.children}
      </span>
    )
  }
}
