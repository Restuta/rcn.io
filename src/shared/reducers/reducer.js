import { SHOW_ALL_EVENTS, TOGGLE_BASELINE, TOGGLE_3X3_GRID } from 'shared/actions/actions.js'
import { combineReducers } from 'redux'

const initialState = {
  debug: {
    showBaseline: false,
    show3x3Grid: false,
    showContainerEdges: false,
  },

  showAllEvents: false,

  calendar: {
    id: null,
    // showAllEvents: false,
    events: null, //array of ids
  },
  //events: null //array of objects
}

export function debug(state = initialState.debug, action) {
  console.info(action)
  switch (action.type) {
    case TOGGLE_BASELINE:
      return Object.assign({}, state, {showBaseline: !state.showBaseline})
    case TOGGLE_3X3_GRID:
      return Object.assign({}, state, {show3x3Grid: !state.show3x3Grid})
    default:
      return state
  }
}

export function calendar(state = initialState.calendar, action) {
  switch (action.type) {
    case SHOW_ALL_EVENTS:
      return Object.assign({}, state, {
        showAllEvents: true
      })
    default:
      return state
  }
}



const rootReducer = combineReducers({
  debug,
  calendar
})

export default rootReducer
