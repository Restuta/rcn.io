import { Disciplines, Statuses } from 'calendar/events/types'
import Colors from 'styles/colors'

//TODO: refactor to use types from types.js

const getEventColor = (discipline, type, status) => {
  let eventColor

  switch (status) {
    case 'Cancelled':
      eventColor = Colors.event.status.cancelled
      break
    case 'Moved':
      eventColor = Colors.event.status.moved
      break
    case 'Past':
      eventColor = Colors.event.status.past
      break
    default:
      break
  }

  if (eventColor) return eventColor

  if (discipline === Disciplines.mtb) {
    eventColor = Colors.event.mtb.default
  }

  if (discipline === Disciplines.road) {
    switch (type) {
      case 'Road Race':
        eventColor = Colors.event.road.roadRace
        break
      case 'Criterium':
        eventColor = Colors.event.road.criterium
        break
      case 'Hill Climb':
        eventColor = Colors.event.road.hillClimb
        break
      case 'Circuit Race':
        eventColor = Colors.event.road.circuitRace
        break
      case 'Time Trial':
        eventColor = Colors.event.road.timeTrial
        break
      case 'Stage Race':
        eventColor = Colors.event.road.stageRace
        break
      case 'Omnium':
        eventColor = Colors.event.road.omnium
        break
      default:
        eventColor = Colors.event.other.unknownType
        break
    }
  }

  return eventColor
}

export {
  getEventColor
}
