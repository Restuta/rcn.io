import React, {PropTypes} from 'react'
import classNames from 'classnames'
import './Icon.scss'
import { pxToRem } from 'styles/typography'

export default class Icon extends React.PureComponent {
  render() {
    const { name, color = '', size, top = 0 } = this.props

    let style = {}

    if (color) {
      style.color = color
    }

    if (size) {
      style = {
        ...style,
        fontSize: `${size}rem`,
        // lineHeight: `${size}rem`,
        maxWidth: `${size}rem`,
        maxHeight: `${size}rem`,
        lineHeight: `${size}rem`,
      }
    }

    if (top !== 0) {
      style.position = 'relative'
      style.top = pxToRem(top) + 'rem'
    }

    const className = classNames('material-icons Icon', this.props.className)
    return (
      <i className={className} style={style}>
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
}
