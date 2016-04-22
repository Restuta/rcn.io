import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Location.scss'
import Icon from 'atoms/Icon.jsx'

export default class Location extends Component {
  render() {
    const {city, state} = this.props

    return (
      <div className="Location">
        <Icon name="map-marker"></Icon><a>{city}, {state}</a>
      </div>
    )
  }
}

Location.propTypes = {
  city: PropTypes.string,
  state: PropTypes.string,
}
