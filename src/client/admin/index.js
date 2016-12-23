import React from 'react'
import Component from 'react-pure-render/component'
import { Link } from 'react-router'

export default class AdminIndex extends Component {
  render() {

    return (
      <div className="AdminIndex">
        <h1>Admin Tools</h1>
        <ul>
          <li><Link to={'/admin/events/create-id'}>Create Event Id</Link></li>
        </ul>
        <hr/>

        {this.props.children}
      </div>
    )
  }
}

AdminIndex.propTypes = {}
