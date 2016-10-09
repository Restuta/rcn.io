import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'

export default class Widget extends Component {
  render() {

    return (
      <div className="Widget container-fluid">Hello, I am widget 🐰</div>
    )
  }
}

Widget.propTypes = {}
