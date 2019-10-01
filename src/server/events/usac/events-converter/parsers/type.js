const { lowerCase, flow, contains, partialRight } = require('lodash/fp')
const { Disciplines, EventTypes } = require('@rcn/events-core/event-types')
const { normalizeSpaces } = require('../utils')

const parseMtbType = lowerCaseName => {
  const nameContains = partialRight(contains, [lowerCaseName])

  if (nameContains('enduro')) {
    return EventTypes.mtb.enduro
  } else if (nameContains('clinics')) {
    return EventTypes.mtb.clinics
  } else {
    return EventTypes.mtb.default
  }
}

const parseRoadType = lowerCaseName => {
  const nameContains = partialRight(contains, [lowerCaseName])

  if (nameContains('road race')) {
    return EventTypes.road.roadRace
  } else if (nameContains('criterium') || nameContains('crit')) {
    return EventTypes.road.criterium
  } else if (nameContains('circuit')) {
    return EventTypes.road.circuitRace
  } else if (nameContains('team time trial')) {
    return EventTypes.road.teamTimeTrial
  } else if (nameContains('time trial')) {
    return EventTypes.road.timeTrial
  } else if (nameContains('stage race')) {
    return EventTypes.road.stageRace
  } else if (nameContains('clinic')) {
    return EventTypes.road.clinics
  } else if (nameContains('hill climb')) {
    return EventTypes.road.hillClimb
  } else {
    // if nothing matches changes are high it's a criterium, but we can't assume that
    return EventTypes.road.default
  }
}

const parseCyclocross = lowerCaseName => {
  const nameContains = partialRight(contains, [lowerCaseName])

  if (nameContains('Clinics')) {
    EventTypes.cyclocross.clinics
  } else {
    return EventTypes.cyclocross.default
  }
}

const parseTrack = lowerCaseName => {
  const nameContains = partialRight(contains, [lowerCaseName])

  if (nameContains('Clinics')) {
    EventTypes.track.clinics
  } else {
    return EventTypes.track.default
  }
}

const parseCollegiate = lowerCaseName => {
  const nameContains = partialRight(contains, [lowerCaseName])

  if (nameContains('road race')) {
    return EventTypes.collegiate.roadRace
  } else if (nameContains('criterium') || nameContains('crit')) {
    return EventTypes.collegiate.criterium
  } else if (nameContains('circuit')) {
    return EventTypes.collegiate.circuitRace
  } else if (nameContains('team time trial')) {
    return EventTypes.collegiate.teamTimeTrial
  } else if (nameContains('time trial')) {
    return EventTypes.collegiate.timeTrial
  } else if (nameContains('stage race')) {
    return EventTypes.collegiate.stageRace
  } else if (nameContains('clinic')) {
    return EventTypes.collegiate.clinics
  } else if (nameContains('hill climb')) {
    return EventTypes.collegiate.hillClimb
  } else {
    // if nothing matches changes are high it's a criterium, but we can't assume that
    return EventTypes.collegiate.default
  }
}

const typeParserByDiscipline = {
  [Disciplines.mtb]: parseMtbType,
  [Disciplines.road]: parseRoadType,
  [Disciplines.cyclocross]: parseCyclocross,
  [Disciplines.track]: parseTrack,
  [Disciplines.bmx]: () => EventTypes.bmx.default,
  [Disciplines.other]: () => EventTypes.other.default,
  [Disciplines.collegiate]: parseCollegiate,
}

const parseType = ({ nameRaw, discipline, competitive }) => {
  if (competitive === 'competitive') {
    const lowerCaseName = flow(lowerCase, normalizeSpaces)(nameRaw)

    return typeParserByDiscipline[discipline](lowerCaseName)
  } else {
    return EventTypes[discipline].nonCompetitive
  }
}

module.exports = parseType
