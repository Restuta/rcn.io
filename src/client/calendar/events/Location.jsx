import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Location.scss'
import Sizes from 'atoms/card-sizes'
import IconLabel from 'atoms/IconLabel.jsx'

export default class Location extends Component {
  render() {
    const { location, size, showState = false } = this.props
    const { city, state } = location

    let addressToShow = showState ? `${city}, ${state}` : city

    if (!city || !city.trim()) {
      addressToShow =  '?'
    } else {
      addressToShow =  showState ? `${city}, ${(state || '?')}` : city
    }

    return (
      <IconLabel className="Location" icon="place" size={size}>{addressToShow}</IconLabel>
    )
  }
}

Location.propTypes = {
  location: PropTypes.shape({
    city: PropTypes.string,
    state: PropTypes.string,
    streetAddress: PropTypes.string,
    zip: PropTypes.string
  }),
  //showState: PropTypes.boolean,
  size: PropTypes.oneOf(Object.keys(Sizes)).isRequired
}
