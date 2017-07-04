import React from 'react'
import Component from 'react-pure-render/component'
import { Link } from 'react-router'
import Colors from 'styles/colors'
import App from 'client/App'

class Admin extends Component {
  render() {
    const listStyle = { color: Colors.deepPurple200, }
    const inactiveStyle = { color: Colors.deepPurple300, }
    const activeStyle = {
      color: Colors.deepPurple600,
      fontWeight: '700',
    }

    return (
      // <App {...this.props} useStaticLinks>
      <div className="AdminRoot">
        <h1>
          <Link activeStyle={activeStyle} to={"/"}>Admin Tools</Link>
        </h1>
        <ul className="text-3" style={listStyle}>
          <li>
            <Link activeStyle={activeStyle} style={inactiveStyle} to={'/events/create-id'}>
              Create Event Id
            </Link>
          </li>
          <li>
            <Link activeStyle={activeStyle} style={inactiveStyle} to={'/events/upload-flyer'}>
            Upload Flyer
            </Link>
          </li>
        </ul>
        <hr/>
        {this.props.children || 'Select one of the above'}
      </div>
      // </App>
    )
  }
}

export default (props) => (
  <App {...props} useStaticLinks>
    {/* pass all routing props down, treating it like routed component */}
    <Admin {...props}/>
  </App>
)

Admin.propTypes = {}
