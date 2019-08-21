import React from 'react'
import PropTypes from 'prop-types'
import Component from 'react-pure-render/component'
import './Button.scss'
import classnames from 'classnames'
import Icon from 'atoms/Icon.jsx'

export default class Button extends Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    if (!this.props.disabled) {
      this.props.onClick(...arguments)
    }
  }


  render() {
    const {
      type = 'secondary',
      size = 'md',
      primaryHover,
      disabled = false,
      onClick,
      className,
      icon,
      style,
      link = false,
      href = '',
    } = this.props

    const iconOnlyButton = (!this.props.children && icon)

    const classes = classnames(`Button Button-${size} btn`,
      `btn-${type}`,
      `btn-${size} fix-fout`,
      {
        'primary-hover': primaryHover,
        'disabled': disabled,
        'btn-icon-only': iconOnlyButton,
        // 'button-link': link,
      },

      className
    )
    const iconSize = {
      sm: 2.25,
      md: 2.5,
      lg: 2.75,
    }
    const iconComp = icon && <Icon name={icon} size={iconSize[size]} top={1}/>

    return (
      link ? (
        <a href={href || 'javascript:;'} className={classes} onClick={onClick} disabled={disabled}
          style={style} role="button" tabIndex={disabled ? '-1' : undefined}>
          {iconComp}{this.props.children}
        </a>
      ) : (
        <button className={classes} onClick={onClick} disabled={disabled} style={style}>
          {iconComp}{this.props.children}
        </button>
      )

    )
  }
}

Button.propTypes = {
  type: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'warning']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  link: PropTypes.bool,
  href: PropTypes.string,
  outline: PropTypes.bool,
  primaryHover: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  style: PropTypes.object,
}
