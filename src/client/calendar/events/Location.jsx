import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Location.scss'

export default class Location extends Component {
  render() {
    const {city, state} = this.props

    return (
      <div className="Location">
        <a>{city}, {state}</a>
      </div>
    )
  }
}

Event.propTypes = {
  city: PropTypes.string,
  state: PropTypes.string,
}
