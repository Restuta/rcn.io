import React, { PropTypes } from 'react'
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
      customFontSize
    } = this.props


    const style = {
      color: color,
      backgroundColor: bgColor,
      height: `${heightRem}rem`,
    }

    if (!customFontSize) {
      style.fontSize = scaleUp(heightRem - 1) + 'rem'
    }

    if (borderColor) {
      style.border = `1px solid ${borderColor}`
    }

    const classNames = classnames('Badge', className, this.props.className, {
      'square': square,
      'inverted': inverted,
    })

    return (
      <span className={classNames} style={style}>
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
}
