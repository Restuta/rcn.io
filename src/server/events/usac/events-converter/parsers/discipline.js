const { Disciplines } = require('client/calendar/events/types')

const parseDiscipline = rawDiscipline => {
  const usacToRcnDisciplinesMap = {
    'Road': Disciplines.road,
    'Track': Disciplines.track,
    'Mountain': Disciplines.mtb,
    'Cyclocross': Disciplines.cyclocross,
    'Collegiate': Disciplines.collegiate,
    'BMX': Disciplines.bmx
  }

  const rcnDiscipline = usacToRcnDisciplinesMap[rawDiscipline]

  if (!rcnDiscipline) {
    throw new Error(`Unknown discipline: ${rawDiscipline}`)
  }

  return rcnDiscipline
}

module.exports = parseDiscipline
