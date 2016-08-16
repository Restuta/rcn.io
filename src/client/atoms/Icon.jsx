import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import classNames from 'classnames'
import './Icon.scss'
import { pxToRem } from 'styles/typography'

export default class Icon extends Component {
  render() {
    const { name, color = '', size, top = 0 } = this.props
    const iconNameClass = 'material-icons'

    let style = {
      color: color
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

    const className = classNames('Icon', iconNameClass, this.props.className)
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
