import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import './UsacLogo.scss'
import classnames from 'classnames'
import UsacLogoPath from 'public/img/usac-logo.svg'

export default class UsacLogo extends Component {
  render() {
    const { size = 2 } = this.props
    const classNames = classnames(`UsacLogo size-${size}`)

    return (
      <img src={UsacLogoPath} className={classNames} alt="Usac Logo"></img>
    )
  }
}

UsacLogo.propTypes = {
  size: PropTypes.oneOf([1, 2, 3, 4]),
}
