const Disciplines = {
  mtb: 'MTB',
  road: 'Road',
  cyclocross: 'Cyclocross',
  track: 'Track',
  bmx: 'BMX',
  other: 'Other'
}

const Statuses = {
  canceled: 'Canceled',
  moved: 'Moved'
}

const EventTypes = {
  other: {
    meeting: 'Meeting'
  },
  road: {
    criterium: 'Criterium',
    roadRace: 'Road Race',
    circuitRace: 'Circuit Race',
    timeTrial: 'Time Trial',
    hillClimb: 'Hill Climb',
    omnium: 'Omnium',
    stageRace: 'Stage Race',
    clicnics: 'Clinics',
    nonCompetitive: 'Non-Competitive'
  },
  cyclocross: {
    clicnics: 'Clinics',
    nonCompetitive: 'Non-Competitive'
  },
  mtb: {
    enduro: 'Enduro',
    clicnics: 'Clinics',
    nonCompetitive: 'Non-Competitive',
    //...
  },
  track: {
    clicnics: 'Clinics',
    nonCompetitive: 'Non-Competitive',
  }
}

export {
  Disciplines,
  Statuses,
  EventTypes,
}
