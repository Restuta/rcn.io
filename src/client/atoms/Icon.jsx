import React from 'react'
import PropTypes from 'prop-types'
import Component from 'react-pure-render/component'
import classNames from 'classnames'
import './Icon.scss'
import { pxToRem } from 'styles/typography'

export default class Icon extends Component {
  render() {
    const {
      name,
      color = '',
      size,
      top = 0,
      style,
    } = this.props

    let iconStyle = style || {}

    if (color) {
      iconStyle.color = color
    }

    if (size) {
      iconStyle = {
        ...iconStyle,
        fontSize: `${size}rem`,
        // lineHeight: `${size}rem`,
        maxWidth: `${size}rem`,
        maxHeight: `${size}rem`,
        lineHeight: `${size}rem`,
      }
    }

    if (top !== 0) {
      iconStyle.position = 'relative'
      iconStyle.top = pxToRem(top) + 'rem'
    }

    const className = classNames('material-icons Icon fix-fout', this.props.className)
    return (
      <i className={className} style={iconStyle}>
        {/* ∞ */}
        {name}
        {/*{this.props.children }*/}
      </i>
    )
  }
}

Icon.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number, //in rems
  top: PropTypes.number, //top offset in px
  style: PropTypes.object,
}
