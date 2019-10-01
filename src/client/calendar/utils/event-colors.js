import { Disciplines } from '@rcn/events-core/event-types'
import Colors from 'styles/colors'

//TODO: refactor to use types from types.js

const getEventColor = (discipline, type, status = '') => {
  let eventColor = ''
  switch (status) {
    case 'Canceled':
      eventColor = Colors.event.status.canceled
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

  if (type === 'Clinics') {
    eventColor = Colors.event.road.clinics
    return eventColor
  }

  if (type === 'Nationals') {
    eventColor = Colors.event.road.nationals
    return eventColor
  }

  if (discipline === Disciplines.mtb) {
    eventColor = Colors.event.mtb.default
  }

  if (discipline === Disciplines.other) {
    switch (type) {
      case 'Meeting':
        eventColor = Colors.event.other.meeting
        break
      default:
        eventColor = Colors.event.other.unknownType
        break
    }
  }

  if (discipline === Disciplines.cyclocross) {
    eventColor = Colors.event.cyclocross.default
  }

  if (discipline === Disciplines.track) {
    eventColor = Colors.event.track.default
  }

  if (discipline === Disciplines.collegiate) {
    switch (type) {
      case 'MTB':
        eventColor = Colors.event.collegiate.mtb
        break
      case 'Road Race':
        eventColor = Colors.event.collegiate.roadRace
        break
      case 'Criterium':
        eventColor = Colors.event.collegiate.criterium
        break
      case 'Hill Climb':
        eventColor = Colors.event.collegiate.hillClimb
        break
      case 'Circuit Race':
        eventColor = Colors.event.collegiate.circuitRace
        break
      case 'Time Trial':
        eventColor = Colors.event.collegiate.timeTrial
        break
      case 'Team Time Trial':
        eventColor = Colors.event.collegiate.teamTimeTrial
        break
      case 'Stage Race':
        eventColor = Colors.event.collegiate.stageRace
        break
      case 'Omnium':
        eventColor = Colors.event.collegiate.omnium
        break
      case 'Clinics':
        eventColor = Colors.event.collegiate.clinics
        break
      default:
        eventColor = Colors.event.collegiate.default
        break
    }
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
      case 'Team Time Trial':
        eventColor = Colors.event.road.teamTimeTrial
        break
      case 'Stage Race':
        eventColor = Colors.event.road.stageRace
        break
      case 'Omnium':
        eventColor = Colors.event.road.omnium
        break
      case 'Clinics':
        eventColor = Colors.event.road.clinics
        break
      default:
        eventColor = Colors.event.road.default
        break
    }
  }

  return eventColor || 'white'
}

export {
  getEventColor
}
