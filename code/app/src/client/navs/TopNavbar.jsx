import React from 'react'
import Component from 'react-pure-render/component'
import classnames from 'classnames'
import './TopNavbar.scss'

export default class TopNavbar extends Component {
  render() {
    const classNames = classnames('TopNavbar', 'navbar navbar-light bg-faded')

    return (

      <nav className={classNames}>
        <div className="content">
           <a className="navbar-brand" href="#">RCN</a>
        </div>
      </nav>

    )
  }
}
