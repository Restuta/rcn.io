import React from 'react'
import InlineSVG from 'svg-inline-react'
//first "!" disables pre-loaders
import LogoSVG from '!svg-inline?!navs/logo.svg'

import './Logo.scss'


export default class Logo extends React.PureComponent {
  render() {
    return (
      <InlineSVG src={LogoSVG} className="Logo" />
    )
  }
}
