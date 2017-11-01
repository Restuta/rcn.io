import React from 'react'
import PropTypes from 'prop-types'
import Component from 'react-pure-render/component'

export default class AddressLInk extends Component {
  render() {

    const {
      location,
      boldCity = true,
      url = '',
      style,
      className
    } = this.props

    const {
      streetAddress = '',
      city = '',
      state = '',
      zip = '',
    } = location


    const streetComp = streetAddress.trim() ? <span>{streetAddress}, </span> : null
    const cityComp = city.trim() ? <span style={{fontWeight: boldCity ? 700 : 500}}>{city}</span> : null
    const stateComp = state.trim() ? <span>, {state}</span> : null
    const zipComp = zip.trim() ? <span> {zip}</span> : null


    return (
      <a href={url} target="_blank" style={style} className={className}>
        {streetComp}{cityComp}{stateComp}{zipComp}
      </a>
    )
  }
}

AddressLInk.propTypes = {
  location: PropTypes.shape({
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string,
  }).isRequired,
  url: PropTypes.string.isRequired,
  boldCity: PropTypes.bool,
}
