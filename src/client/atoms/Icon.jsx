import React from 'react'
import Component from 'react-pure-render/component'
import classNames from 'classnames'
import './Icon.scss'

export default class Icon extends Component {
  render() {
    const {name, color} = this.props
    const iconNameClass = `fa fa-${name}`
    const style = {color: color}

    const className = classNames('Icon', iconNameClass, this.props.className)
    return (
      <i className={className} style={style} {...this.props}>
        {this.props.children }
      </i>
    )
  }
}
