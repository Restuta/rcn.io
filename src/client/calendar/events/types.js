const Disciplines = {
  mtb: 'MTB',
  road: 'Road',
  cyclocross: 'Cyclocross',
  track: 'Track',
  bmx: 'BMX'
}

const Statuses = {
  cancelled: 'Cancelled',
  moved: 'Moved'
}

const EventTypes = {
  road: {
    criterium: 'Criterium',
    roadRace: 'Road Race',
    circuitRace: 'Circuit Race',
    timeTrial: 'Time Trial',
    hillClimb: 'Hill Climb',
    omnium: 'Omnium',
    stageRace: 'Stage Race'
  },
  mtb: {
    enduro: 'Enduro',
    //...
  }
}

export {
  Disciplines,
  Statuses,
  EventTypes,
}
