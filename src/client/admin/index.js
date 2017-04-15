import React from 'react'
import Component from 'react-pure-render/component'
import { Link } from 'react-router'
import Colors from 'styles/colors'

export default class AdminIndex extends Component {
  render() {

    const listStyle = {
      color: Colors.deepPurple200,
    }

    const inactiveStyle = {
      color: Colors.deepPurple300,
    }

    const activeStyle = {
      color: Colors.deepPurple600,
      fontWeight: '700',
    }

    return (
      <div className="AdminIndex">
        <h1>Admin Tools</h1>
        <ul className="text-3" style={listStyle}>
          <li><Link activeStyle={activeStyle} style={inactiveStyle} to={'/admin/events/create-id'}>Create Event Id</Link></li>
          <li><Link activeStyle={activeStyle} style={inactiveStyle} to={'/admin/events/upload-flyer'}>Upload Flyer</Link></li>
        </ul>
        <hr/>
        {this.props.children || 'select one of the above'}
      </div>
    )
  }
}

AdminIndex.propTypes = {}
