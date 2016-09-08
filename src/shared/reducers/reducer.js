import { combineReducers } from 'redux'
import { handleActions as makeReducer } from 'redux-actions'
import { routerReducer } from 'react-router-redux'
import {
  norcalMtb2016Events,
  testRoadEvents2016,
} from 'client/temp/events.js'
import { createSelector } from 'reselect'
import Colors from 'client/styles/colors'

/*  current event flow:
    => read from file
    => preProcessEvents() //creates events array in our format
    => add to all events (.contact on initialState)
    => link ids to calendar
    => selector: create event's map by date
*/

//TODO bc: set calendar ID to every event, but don't do it in this function
// it should be done at the time of creation of imported events
const toByIdMap = objects => objects.reduce((map, x) => {
  map[x.id] = x
  return map
}, {})

const toArrayOfIds = objects => objects.map(x => x.id)
const testRoadEventIds = toArrayOfIds(testRoadEvents2016)

const initialState = {
  app: {
    containerWidth: null,
  },
  debug: {
    showBaseline: false,
    show3x3Grid: false,
    showContainerEdges: false,
  },

  events: toByIdMap(norcalMtb2016Events.concat(testRoadEvents2016)),

  //calenars map by id
  calendars: {
    ['cal-norcal-mtb-2016']: {
      id: 'cal-norcal-mtb-2016',
      year: 2016,
      name: 'NorCal MTB Calendar 2016',
      highlight: {
        word: 'MTB',
        color: Colors.brownMud
      },
      timeZone: 'America/Los_Angeles',
      showPastEvents: false,
      eventsIds: toArrayOfIds(norcalMtb2016Events)
    },
    ['cal-ncnca-2017-draft']: {
      id: 'cal-ncnca-2017-draft',
      year: 2017,
      name: 'NCNCA Calendar 2017',
      // highlight: {
      //   word: 'NCNCA',
      //   color: Colors.red800,
      // },
      description: 'Most recent draft',
      timeZone: 'America/Los_Angeles',
      showPastEvents: true,
      draft: true,
      eventsIds: [],
      loaded: false,
    },
    ['cal-ncnca-2016']: {
      id: 'cal-ncnca-2016',
      year: 2016,
      name: 'NCNCA Calendar 2016',
      highlight: {
        word: 'NCNCA',
        color: Colors.red800,
      },
      description: '',
      timeZone: 'America/Los_Angeles',
      showPastEvents: true,
      draft: false,
      eventsIds: [],
      loaded: false,
    },

    ['cal-test-1']: {
      showPastEvents: true,
      eventsIds: testRoadEventIds,
    },
    ['cal-test-2']: { eventsIds: testRoadEventIds },
    ['cal-test-3']: { eventsIds: testRoadEventIds },
    ['cal-test-4']: { eventsIds: testRoadEventIds },
  }
}


export const calendars = makeReducer({
  ['Cal.TOGGLE_PAST_EVENTS']: (state, action) => {
    const calendarId = action.payload.calendarId
    const calendar = state[calendarId]

    if (calendar) {
      return {
        ...state,
        [calendarId]: {
          ...calendar,
          showPastEvents: !calendar.showPastEvents
        }
      }
    } else {
      throw new Error(`No calendar corresponding to id: ${calendarId}`)
    }
  },
  ['Cal.CALENDAR_FETCH_SUCCEDED']: (state, action) => {
    const calendarId = action.payload.calendarId
    const calendar = state[calendarId]
    const events = action.payload.events

    if (calendar) {
      return {
        ...state,
        [calendarId]: {
          ...calendar,
          eventsIds: toArrayOfIds(events),
          loaded: true,
        }
      }
    }
    return state
  }
}, initialState.calendars)


export const debug = makeReducer({
  ['Dbg.TOGGLE_BASELINE']: (state, action) => ({...state, showBaseline: !state.showBaseline}),
  ['Dbg.TOGGLE_3X3_GRID']: (state, action) => ({...state, show3x3Grid: !state.show3x3Grid}),
  ['Dbg.TOGGLE_CONTAINER_EDGES']: (state, action) => ({...state, showContainerEdges: !state.showContainerEdges}),
}, initialState.debug)

// export const events = (prevState = initialState.events, action) => prevState

export const events = makeReducer({
  ['Cal.CALENDAR_FETCH_SUCCEDED']: (state, action) => {
    const events = action.payload.events
    const eventsMap = toByIdMap(events)
    return {
      ...state,
      ...eventsMap
    }
  }
}, initialState.events)

const rootReducer = combineReducers({
  debug,
  calendars,
  events,
  routing: routerReducer,
})



// ----------
// SELECTORS

// transforms array of events to Map where "key" is short version of date and "value" is Event
const eventsToMapByDate = events => {
  const eventsMap = new Map()

  events.forEach(event => {
    const key = event.datePlain || event.date.format('MMDDYYYY')

    if (eventsMap.get(key)) {
      eventsMap.get(key).push(event)
    } else {
      eventsMap.set(key, [event])
    }
  })

  return eventsMap
}


// creates an object that represents events mapped by Date + helper methods
const eventsByDate = (events) => {
  const eventsMap = eventsToMapByDate(events)

  // gets total number of events from the given date
  const getTotalFrom = date => {
    let total = 0

    eventsMap.forEach((value, key, map) => {
      const events = value
      //taking date of first event since the rest is after it
      const eventsDate = events[0].date
      const eventsCount = events.length

      if (date.diff(eventsDate, 'days') <= 0) {
        total += eventsCount
      }
    })

    return total
  }

  return {
    map: eventsMap,
    total: events.length,

    //TODO: write test for getTotalFrom
    getTotalFrom: getTotalFrom
  }
}

const getEvent = (state, id) => state.events[id]

const getCalendar = (state, props) => state.calendars[props.calendarId]
const getAllEvents = state => state.events
const getEventIdsForCalendar = (state, props) => getCalendar(state, props).eventsIds

const getEventsByDateForCalendar = createSelector(
  getEventIdsForCalendar,
  getAllEvents,
  (eventIds, allEvents) => eventsByDate(eventIds.map(id => allEvents[id]))
)

const getEventsForCalendar = createSelector(
  getEventIdsForCalendar,
  getAllEvents,
  (eventIds, allEvents) => eventIds.map(x => allEvents[x])
)

export {
  getEvent,
  getCalendar,
  getEventsByDateForCalendar,
  getEventsForCalendar,
}

export default rootReducer
