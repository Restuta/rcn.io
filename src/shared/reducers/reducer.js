import {SHOW_ALL_EVENTS} from 'shared/actions'

const initialState = {
  showAllEvents: false,

  calendar: {
    id: null,
    showAllEvents: false,
    events: null, //array of ids
  },
  events: null //array of objects
}

export function calendarReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_ALL_EVENTS:
      return Object.assign({}, state, {
        showAllEvents: true
      })
    default:
      return state
  }
}
