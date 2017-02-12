import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import Icon from 'atoms/Icon.jsx'
import './Alert.scss'

export default class Alert extends Component {
  render() {
    const { showIcon = true, type = 'info', style } = this.props

    const iconMap = {
      'success': 'check',
      'info': 'info_outline',
      'warning': 'warning',
      'danger': 'error_'
    }
    const iconToShow = iconMap[type]

    return (
      <div className={`alert alert-${type} Alert`} role="alert" style={style}>
        {showIcon && <Icon name={iconToShow} size={3} style={{marginRight: '0.5rem'}}/>}
        {this.props.children}
      </div>
    )
  }
}

Alert.propTypes = {
  showIcon: PropTypes.bool,
  type: PropTypes.oneOf(['success', 'info', 'warning', 'danger']),
  style: PropTypes.object,
}
