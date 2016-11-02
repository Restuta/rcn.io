import React, { PropTypes } from 'react'
import './UsacLogo.scss'
import classnames from 'classnames'
import UsacLogoPath from 'public/img/usac-logo.svg'

export default class UsacLogo extends React.PureComponent {
  render() {
    const { size = 2, style } = this.props
    const classNames = classnames(`UsacLogo size-${size}`)

    return (
      <img src={UsacLogoPath} className={classNames} alt="Usac Logo" style={style}></img>
    )
  }
}

UsacLogo.propTypes = {
  size: PropTypes.oneOf([1, 2, 3, 4]),
  style: PropTypes.object,
}
