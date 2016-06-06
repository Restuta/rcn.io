import { combineReducers } from 'redux'
import { handleActions as makeReducer } from 'redux-actions'

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


export const calendar = (state = initialState.calendar, action) => {
  return state
}


export const debug = makeReducer({
  ['Dbg.TOGGLE_BASELINE']: (state, action) => ({...state, showBaseline: !state.showBaseline}),
  ['Dbg.TOGGLE_3X3_GRID']: (state, action) => ({...state, show3x3Grid: !state.show3x3Grid}),
  ['Dbg.TOGGLE_CONTAINER_EDGES']: (state, action) => ({...state, showContainerEdges: !state.showContainerEdges}),
}, initialState.debug)

const rootReducer = combineReducers({
  debug,
  calendar,
})

export default rootReducer
