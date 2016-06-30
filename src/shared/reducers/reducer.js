import { combineReducers } from 'redux'
import { handleActions as makeReducer } from 'redux-actions'

const initialState = {
  app: {
    containerWidth: null,
  },
  debug: {
    showBaseline: false,
    show3x3Grid: false,
    showContainerEdges: false,
  },

  //calenars map by id
  calendars: {
    ['cal-0']: {
      // name: 'NorCal MTB Calendar 2016 =)',
      showPastEvents: false,
      eventDetailsModal: {
        isOpen: false,
        eventId: undefined,
      },
    },
    ['cal-test-1']: {},
    ['cal-test-2']: {},
    ['cal-test-3']: {},
    ['cal-test-4']: {}
  }
  //events: null //array of objects
}


export const calendars = makeReducer({
  ['Cal.TOGGLE_PAST_EVENTS']: (state, action) => {
    const calendarId = action.payload.calendarId
    const calendar = state[calendarId]

    if (calendar) {
      return {
        ...state,
        [calendarId] : {
          ...calendar,
          showPastEvents: !calendar.showPastEvents
        }
      }
    } else {
      throw new Error(`No calendar corresponding to id: ${calendarId}`)
    }
  }
}, initialState.calendars)


export const debug = makeReducer({
  ['Dbg.TOGGLE_BASELINE']: (state, action) => ({...state, showBaseline: !state.showBaseline}),
  ['Dbg.TOGGLE_3X3_GRID']: (state, action) => ({...state, show3x3Grid: !state.show3x3Grid}),
  ['Dbg.TOGGLE_CONTAINER_EDGES']: (state, action) => ({...state, showContainerEdges: !state.showContainerEdges}),
}, initialState.debug)

const rootReducer = combineReducers({
  debug,
  calendars,
})

export default rootReducer
