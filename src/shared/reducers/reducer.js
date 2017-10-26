import { combineReducers } from 'redux'
import { handleActions as makeReducer } from 'redux-actions'
import { routerReducer } from 'react-router-redux'
import {
  norcalMtb2016Events,
  ncnca2016Events,
  ncnca2017Events,
  usac2017Events
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

const setEventsCalendarId = calendarId => event => ({...event, calendarId})

const toArrayOfIds = objects => objects.map(x => x.id)

const initialState = {
  app: {
    lastKnownUrlLocation: {
      pathname: undefined,
      search: undefined
    },
    containerWidth: undefined,
    // specifies if last navigation was back from routed modal
    navigatedBackFromModal: false,
    modal: {
      isOpen: false,
      // indicates that current modal replaces previous modal
      replacesPrevModal: false,
      // most modals need padding, but some don't
      hasPadding: true,
      // used for routed modals to replace URL with previous location
      returnLocation: {
        pathname: undefined, // url slug to redirect to when modal is closed
        search: undefined // query string params as it's called in React Router
      }
    }
  },
  browser: {
    width: undefined,
  },
  debug: {
    showBaseline: false,
    show3x3Grid: false,
    showContainerEdges: false,
  },

  events: toByIdMap(
    norcalMtb2016Events.map(setEventsCalendarId('cal-norcal-mtb-2016'))
    .concat(ncnca2016Events.map(setEventsCalendarId('cal-ncnca-2016')))
    .concat(ncnca2017Events.map(setEventsCalendarId('cal-ncnca-2017')))
    .concat(usac2017Events.map(setEventsCalendarId('cal-usac-2017')))
  ),

  //calenars map by id
  calendars: {
    ['cal-norcal-mtb-2016']: {
      id: 'cal-norcal-mtb-2016',
      slug: 'norcal-mtb',
      year: 2016,
      name: '2016 NorCal MTB Calendar',
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
      slug: 'ncnca-2017',
      year: 2017,
      name: '2017 NCNCA Calendar',
      // highlight: {
      //   word: 'NCNCA',
      //   color: Colors.red800,
      // },
      description: 'Draft is locked.',
      timeZone: 'America/Los_Angeles',
      showPastEvents: true,
      draft: true,
      eventsIds: [],
      loaded: false,
    },
    ['cal-ncnca-2018-draft']: {
      id: 'cal-ncnca-2018-draft',
      slug: 'ncnca-2017',
      year: 2018,
      name: '2018 NCNCA Calendar',
      // highlight: {
      //   word: 'NCNCA',
      //   color: Colors.red800,
      // },
      description: 'This calendar connected to google spredsheet',
      warning: 'This is just a DRAFT, events can and will change without notice.',
      timeZone: 'America/Los_Angeles',
      showPastEvents: true,
      draft: true,
      eventsIds: [],
      loaded: false,
    },
    ['cal-ncnca-2016']: {
      id: 'cal-ncnca-2016',
      slug: 'ncnca-2016',
      year: 2016,
      name: '2016 NCNCA Calendar',
      // highlight: {
      //   word: 'NCNCA',
      //   color: Colors.red800,
      // },
      description: '',
      timeZone: 'America/Los_Angeles',
      showPastEvents: false,
      draft: false,
      eventsIds: toArrayOfIds(ncnca2016Events),
    },
    ['cal-ncnca-2017']: {
      id: 'cal-ncnca-2017',
      slug: 'ncnca-2017',
      year: 2017,
      name: '2017 NCNCA Calendar',
      // highlight: {
      //   word: 'NCNCA',
      //   color: Colors.red800,
      // },
      description: '(Filters are coming.)',
      timeZone: 'America/Los_Angeles',
      showPastEvents: false,
      draft: false,
      eventsIds: toArrayOfIds(ncnca2017Events),
    },
    ['cal-usac-2017']: {
      id: 'cal-usac-2017',
      slug: 'usac-2017',
      year: 2017,
      name: '2017 USA Cycling Calendar',
      // highlight: {
      //   word: 'NCNCA',
      //   color: Colors.red800,
      // },
      description: 'Events pulled from usasycling.org. Does not include fun events.',
      timeZone: 'America/Los_Angeles',
      showPastEvents: false,
      draft: false,
      eventsIds: toArrayOfIds(usac2017Events),
    },
  }
}

export const app = makeReducer({
  ['@@router/LOCATION_CHANGE']: (state, action) => {
    const locationState = action.payload.state

    // splitting on sub-actions
    if (locationState && locationState.subActionName) {
      const subActionName = action.payload.state.subActionName

      switch (subActionName) {
        case 'Modal.OPEN_ROUTED_MODAL': {
          return {
            ...state,
            navigatedBackFromModal: false,
            modal: {
              ...state.modal,
              ...locationState.modalProps,
              returnLocation: locationState.modalReturnLocation,
              isOpen: true,
            }
          }
        }
        case 'Modal.REPLACE_ROUTED_MODAL': {
          return {
            ...state,
            navigatedBackFromModal: false,
            modal: {
              ...state.modal,
              ...locationState.modalProps,
              returnLocation: locationState.modalReturnLocation,
              isOpen: true,
              replacesPrevModal: locationState.replacesPrevModal,
            }
          }
        }
        default:
          break
      }
    }

    // if "going back" we should update modal state, so it's properly closed
    if (action.payload.action === 'POP' && state.modal.isOpen) {
      return {
        ...state,
        navigatedBackFromModal: true,
        modal: {
          ...state.modal,
          isOpen: false,
        }
      }
    }

    // if none of the actions above then we just cleaning up since on next location changed
    // it's no longer "navigated back from modal"
    if (state.navigatedBackFromModal) {
      return {
        ...state,
        navigatedBackFromModal: false,
      }
    }

    return state
  },
  ['browser/SET_WIDTH']: (state, action) => {
    if (state.navigatedBackFromModal) {
      return {
        ...state,
        navigatedBackFromModal: false,
      }
    }
    return state
  }
}, initialState.app)

export const browser = makeReducer({
  ['browser/SET_WIDTH']: (state, action) => {
    return {
      ...state,
      width: action.payload.browserWidth,
    }
  }
}, initialState.browser)

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
  app,
  browser,
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


const getEventsForCalendar = createSelector(
  getEventIdsForCalendar,
  getAllEvents,
  (eventIds, allEvents) => eventIds.map(id => allEvents[id])
)

const getEventsByDateForCalendar = createSelector(
  getEventsForCalendar,
  eventsMap => eventsByDate(eventsMap)
)

export {
  getEvent,
  getCalendar,
  getEventsForCalendar,
  getEventsByDateForCalendar,
}

export default rootReducer
