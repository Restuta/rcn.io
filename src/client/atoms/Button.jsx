import React, { PropTypes } from 'react'
import './Button.scss'
import classnames from 'classnames'
import Icon from 'atoms/Icon.jsx'

export default class Button extends React.PureComponent {
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
      icon
    } = this.props

    const iconOnlyButton = (!this.props.children && icon)

    const classes = classnames(`Button Button-${size} btn`,
      `btn-${type}`,
      `btn-${size} fix-fout`,
      {
        'primary-hover': primaryHover,
        'disabled': disabled,
        'btn-icon-only': iconOnlyButton
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
      <button className={classes} onClick={onClick} disabled={disabled}>
        {iconComp}{this.props.children}
      </button>
    )
  }
}

Button.propTypes = {
  type: PropTypes.oneOf(['primary', 'secondary']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  outline: PropTypes.bool,
  primaryHover: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.string,
}
