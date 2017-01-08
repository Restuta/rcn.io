const Disciplines = {
  mtb: 'MTB',
  road: 'Road',
  cyclocross: 'Cyclocross',
  track: 'Track',
  bmx: 'BMX',
  nonCompetitive: 'Non-Competitive',
  other: 'Other'
}

const Statuses = {
  canceled: 'Canceled',
  moved: 'Moved'
}

const EventTypes = {
  other: {
    meeting: 'Meeting',
    clinics: 'Clinics',
  },
  road: {
    'default': 'Road',
    criterium: 'Criterium',
    roadRace: 'Road Race',
    circuitRace: 'Circuit Race',
    timeTrial: 'Time Trial',
    teamTimeTrial: 'Team Time Trial',
    hillClimb: 'Hill Climb',
    omnium: 'Omnium',
    stageRace: 'Stage Race',
    clinics: 'Clinics',
    nationals: 'Nationals',
    nonCompetitive: 'Non-Competitive',
  },
  cyclocross: {
    'default': 'Cyclocross',
    clinics: 'Clinics',
    nationals: 'Nationals',
    nonCompetitive: 'Non-Competitive',
  },
  mtb: {
    'default': 'MTB',
    enduro: 'Enduro',
    clinics: 'Clinics',
    nationals: 'Nationals',
    nonCompetitive: 'Non-Competitive',
  },
  track: {
    'default': 'Track',
    clinics: 'Clinics',
    nationals: 'Nationals',
    nonCompetitive: 'Non-Competitive',
  },
  nonCompetitive: {
    'default': 'Non-Competitive',
    granFondo: 'Gran Fondo',
  }
}

//gets event type abbreviated to 2-4 characters
// const getAbbreviatedType = eventType => {
//   const EventsToAbbreviationTypeMap = {
//     [EventTypes.road.default]: 'rd',
//     [EventTypes.road.criterium]: 'ct',
//     [EventTypes.road.roadRace]: 'rr',
//     [EventTypes.road.circuitRace]: 'cr',
//     [EventTypes.road.timeTrial]: 'tt',
//     [EventTypes.road.teamTimeTrial]: 'ttt',
//     [EventTypes.road.hillClimb]: 'hc',
//     [EventTypes.road.omnium]: 'om',
//     [EventTypes.road.stageRace]: 'sr',
//     [EventTypes.road.clinics]: 'clnx',
//     [EventTypes.road.nonCompetitive]: 'ncmp',
//
//     [EventTypes.cyclocross.default]: 'cx',
//
//     [EventTypes.mtb.default]: 'mtb',
//     [EventTypes.mtb.enduro]: 'ndr',
//
//     [EventTypes.track.default]: 'trk',
//
//     [EventTypes.other.meeting]: 'mtng',
//     [EventTypes.nonCompetitive.granFondo]: 'gf',
//   }
//
//   const abbrType = EventsToAbbreviationTypeMap[eventType]
//
//   if (!abbrType) {
//     throw new Error(`Can't find matching Event Type Abbreviation for: "${eventType}"`)
//   }
//
//   return abbrType
// }
//

export {
  Disciplines,
  Statuses,
  EventTypes,
  // getAbbreviatedType
}
