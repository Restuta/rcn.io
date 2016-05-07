import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Location.scss'
import Icon from 'atoms/Icon.jsx'
import Sizes from './card-sizes'
import classnames from 'classnames'

export default class Location extends Component {
  render() {
    const {location, size, showState = false} = this.props
    let {city, state} = location

    let addressToShow = showState ? `${city}, ${state}` : city

    if (!city || !city.trim()) {
      addressToShow =  '?'
    } else {
      addressToShow =  showState ? `${city}, ${(state || '?')}` : city
    }

    const className = classnames(`Location size-${size} fix-fout`)

    return (
      <div className={className}>
        <Icon name="place" className="icon"/>
        <span className="address">{addressToShow}</span>
      </div>
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
