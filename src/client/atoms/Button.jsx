import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import './Button.scss'
import classnames from 'classnames'

export default class Button extends Component {
  render() {
    const { type = 'secondary', size = 'md', primaryHover } = this.props
    const classes = classnames(`Button Button-${size} btn`,
      `btn-${type}`,
      `btn-${size}`,
      {
        'primary-hover': primaryHover
      }
    )

    return (
      <button className={classes}>{this.props.children}</button>
    )
  }
}

Button.propTypes = {
  type: PropTypes.oneOf(['primary', 'secondary']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  outline: PropTypes.bool,
  primaryHover: PropTypes.bool,
}
