import React from 'react'
import Component from 'react-pure-render/component'
import classnames from 'classnames'
import './TopNavbar.scss'

export default class TopNavbar extends Component {
  render() {
    const classNames = classnames('TopNavbar', 'navbar navbar-dark bg-faded')

    return (
      <nav className={classNames}>
        <div className='content'>
          <b>RCN</b>
        </div>
      </nav>
    )
  }
}
