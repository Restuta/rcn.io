import React from 'react'
import Component from 'react-pure-render/component'
import InlineSVG from 'svg-inline-react'
import LogoSVG from './logo.svg'


export default class Logo extends Component {
  render() {

    const style = {
      width: '2.5rem',
      height: '4rem',
      marginBottom: -2 //should go away when we use logo with no paddings
    }

    return (
      <InlineSVG  style={style} src={LogoSVG} />
    )
  }
}
