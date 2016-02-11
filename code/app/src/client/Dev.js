import React from 'react'
import Component from 'react-pure-render/component'
import './styles/bootstrap.scss'
import './app.scss'
import { Link } from 'react-router'

export default class Dev extends Component {
  render() {
    return (
      <div className="container">
        <h1>Hello dev world √∑ø</h1>
        <Link to="/">Home</Link>
      </div>

    )
  }
}
