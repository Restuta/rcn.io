const { log, inspect } = require('server/utils')
const { flow, map, get, uniq, trim, upperCase, replace, split, isArray } = require('lodash/fp')
const usac2017CnRoadEvensRaw = require('../raw/2017-CN-road')
const { createShortEventId, createPrettyEventId } = require('shared/events/gen-event-id.js')
const { parseDate } = require('./parsers')

log.debug(usac2017CnRoadEvensRaw.length)

// address https://www.npmjs.com/package/addressit

const { normalizeSpaces, toUpperCaseFirst } = require('./utils')

const parseCityState = cityStateRaw => {
  const cityState = flow(
    normalizeSpaces,
    // TODO: tweak this for other states using array of states
    replace(' CA, CA', ' CA'),
    replace(' ,', ',')
  )(cityStateRaw)

  let [city, state] = split(',', cityState)
  city = flow(trim, toUpperCaseFirst)(city)
  state = flow(trim, upperCase)(state)
  log.debug(city)
  log.debug(state)

  if (!city || city.length <= 2) {
    throw new Error(`City was not found in the following locaiton.cityStae: ${cityState}`)
  }
  if (!state) {
    throw new Error(`State was not found in the following locaiton.cityStae:  ${cityState}`)
  }
  if (state.length !== 2) {
    throw new Error(`State must be of lenth 2, locaiton.cityStae:  ${cityState}`)
  }
}


const parseLocation = rawLocation => {
  const detailedLocation = rawLocation.detailed

  let streetAddress
  let city
  let state

  if (isArray(detailedLocation)) {
    if (detailedLocation.length === 2) {
      let [ streetAddressRaw, cityStateRaw ] = detailedLocation

    } else if (detailedLocation.length === 1) {

    } else {
      throw new Error(`Detailed location array is of lengh: ${detailedLocation.length}`
        + `, not sure what to do with it: ` + inspect(detailedLocation))
    }
  }

  const detailedLocation =


  return {
    // name: '',
    // streetAddress: '',
    city,
    state,
    // zip: '',
  }
}


const convertToInternalFormat = rawUsacEvent => {
  const shortId = createShortEventId()
  const rcnEvent = {
    id: createPrettyEventId(rawUsacEvent.year, rawUsacEvent.name, 'usac', shortId),
    _shortId: shortId,
    name: rawUsacEvent.name,
    date: parseDate(rawUsacEvent.dates),
    location: parseLocation(rawUsacEvent.location),
    usac: {
      status: rawUsacEvent.status,
      category: rawUsacEvent.usacCategory,
      type: rawUsacEvent.usacEventType
    }
  }

  return rcnEvent
}


// main processing pipeline
const processEvents = flow(
  map(convertToInternalFormat),
  map(log.debug)
  // map(validateOverSchema)
)

// processEvents(usac2017CnRoadEvensRaw)

const logPathUnique = (path, events) =>
  flow(
    map(event => get(path, event)),
    uniq,
    map(log.debug)
  )(events)

logPathUnique('location.detailed', usac2017CnRoadEvensRaw)


// 54.227.184.196
// 34.224.64.25
//  54.227.184.196
