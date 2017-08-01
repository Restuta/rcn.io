const log = require('server/utils/log')
const { flow, get, trim, upperCase, replace, split, isArray, startCase, lowerCase } = require('lodash/fp')
const { normalizeSpaces  } = require('../utils')

// eslint-disable-next-line
const statesRegex = new RegExp('(AK|AL|AR|AZ|CA|CO|CT|DC|DE|FL|GA|GU|HI|IA|ID|IL|IN|KS|KY|LA|MA|MD|ME|MI|MN|MO|MS|MT|NC|ND|NE|NH|NJ|NM|NV|NY|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|VI|VT|WA|WI|WV|WY)')
// const zipRegex = /(\d{5}(-\d{4})?)/
// const statePlusZipRegex = new RegExp(`${statesRegex.source}\\s${zipRegex.source}`)
// const endsWithStateAndZip = addressString => addressString.match(statePlusZipRegex)

// normalizes spaces, fixes mistakes
const normalizeAndFix = flow(
  normalizeSpaces,
  // TODO: tweak this for other states using array of states
  replace(' CA, CA', ' CA'),
  replace(' ,', ','),
  // cherry-picked hacks
  // TODO: ideally we need a way to fixup particular events manually on data level, not on code level

  // fixing paticular event that has name of the sate where city name is expected
  replace(', California, CA', ', CA'),
  replace('Bariani Olive Oil, Zamora, CA', 'Bariani Olive Oil')
)

// address https://www.npmjs.com/package/addressit
//
const parseCityState = cityStateRaw => {
  const cityState = normalizeAndFix(cityStateRaw)

  let [city, state] = split(',', cityState)
  city = flow(trim, lowerCase, startCase)(city)
  state = flow(trim, upperCase)(state)

  if (!city || city.length <= 2) {
    throw new Error(`City was not found in the following locaiton.cityStae: ${cityState}`)
  }
  if (!state || !state.match(statesRegex)) {
    throw new Error(`State was not found in the following locaiton.cityStae:  ${cityState}`)
  }
  if (state.length !== 2) {
    throw new Error(`State must be of lenth 2, but was ${state.length}, value: "${state}",` + `locaiton.cityStae:  ${cityState}`)
  }

  return { city, state }
}

const parseStreetAddress = streetAddressRaw => {
  const streetAddress = flow(trim, normalizeAndFix)(streetAddressRaw)
  return streetAddress
}

const parseZip = googleMapsUrl => {
  if (!googleMapsUrl) {
    return ''
  }

  const matches = googleMapsUrl.match(/\+(\d{5}(-\d{4})?),/)
  return get('[1]', matches) || ''
}

const parseLocation = rawLocation => {
  const detailedLocation = rawLocation.detailed

  let streetAddress = ''
  let city = ''
  let state = ''

  if (isArray(detailedLocation)) {
    if (detailedLocation.length === 2) {
      let [streetAddressRaw, cityStateRaw] = detailedLocation
      ;({ city, state } = parseCityState(cityStateRaw))
      streetAddress = parseStreetAddress(streetAddressRaw)
    } else {
      throw new Error(
        `Detailed location array is of lengh: ${detailedLocation.length}` +
          ', not sure what to do with it: ' +
          log.inspect(detailedLocation)
      )
    }
  } else {
    // if it's not an array, assuming it only has city/state
    ({ city, state } = parseCityState(detailedLocation))
  }

  const zip = parseZip(rawLocation.googleMapsUrl)

  return {
    // name: '',
    streetAddress,
    city,
    state,
    zip
  }
}

module.exports = parseLocation
