import React from 'react'
import Component from 'react-pure-render/component'
import InlineSVG from 'svg-inline-react'


export default class Logo extends Component {
  render() {

    const style = {
      width: '20px',
      marginBottom: -2 //should go away when we use logo with no paddings
    }

    return (
      <InlineSVG  style={style} src={require('./logo.svg')} />
    )
  }
}
