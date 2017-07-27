import React from 'react'
import PropTypes from 'prop-types'
import Component from 'react-pure-render/component'
import classnames from 'classnames'
import './Badge.scss'
import Colors from 'styles/colors'
import { scaleUp } from 'styles/typography'


export default class Badge extends Component {
  render() {
    let {
      square,
      inverted,
      color = Colors.bodyBg,
      bgColor = Colors.blueGrey300,
      heightRem = 2,
      className,
      borderColor,
      customFontSize,
      style,
      topRem = 0,
    } = this.props


    const badgeStyle = Object.assign({
      color: color,
      top: `${topRem}rem`,
      backgroundColor: bgColor,
      height: `${heightRem}rem`,
      //for size <= 2 use non-flexbox alignment since there is a chance it would break a baseline, since there is not
      //enough padding to "fit" font's x-height
      display: (heightRem <= 2) ? 'inline-block' : undefined
    }, style)

    if (!customFontSize) {
      badgeStyle.fontSize = scaleUp(heightRem - 1) + 'rem'
    }

    if (borderColor) {
      badgeStyle.border = `1px solid ${borderColor}`
    }

    const classNames = classnames('Badge', className, this.props.className, {
      'square': square,
      'inverted': inverted,
    })

    return (
      <span className={classNames} style={badgeStyle}>
        {this.props.children}
      </span>
    )
  }
}


Badge.propTypes = {
  square: PropTypes.bool,
  color: PropTypes.string,
  borderColor: PropTypes.string,
  bgColor: PropTypes.string,
  heightRem: PropTypes.oneOf([2, 3, 4, 5, 6, 7, 8]),
  className: PropTypes.string,
  customFontSize: PropTypes.bool,
  style: PropTypes.object,
  topRem: PropTypes.number,
}
