import test from 'tape'
import { createStore } from 'redux'
import {
  debug as debugReducer,
  calendars as calendarsReducer
  } from 'shared/reducers/reducer.js'
import * as actions from 'shared/actions/actions.js'

//simplifies test when you need only one assertion
function test1(name, testBody) {
  return test(name, t => {
    testBody(t)
    t.end()
  })
}

test1(`On '${actions.toggleBaseline().type}' action, 'showBaseline' property should be changed to the opposite`, t => {
  const store = createStore(debugReducer, {showBaseline: true})
  const initialState = store.getState()

  store.dispatch(actions.toggleBaseline())

  let state = store.getState()
  t.equal(state.showBaseline, !initialState.showBaseline)
})

test1(`On '${actions.toggle3x3Grid().type}' action, 'show3x3Grid' property should be changed to the opposite`, t => {
  const store = createStore(debugReducer, {show3x3Grid: true})
  const initialState = store.getState()

  store.dispatch(actions.toggle3x3Grid())

  let state = store.getState()
  t.equal(state.show3x3Grid, !initialState.show3x3Grid)
})

test1(`On '${actions.toggleContainerEdges().type}' action, 'showContainerEdges' property should be changed to the opposite`, t => {
  const store = createStore(debugReducer, {showContainerEdges: true})
  const initialState = store.getState()

  store.dispatch(actions.toggleContainerEdges())

  let state = store.getState()
  t.equal(state.showContainerEdges, !initialState.showContainerEdges)
})

test(`On '${actions.toggleShowPastEvents().type}' action`, t => {
  const store = createStore(calendarsReducer, {
    ['cal-test-0']: {
      showPastEvents: false
    }
  })

  const initialState = store.getState()

  store.dispatch(actions.toggleShowPastEvents('cal-test-0'))
  const state = store.getState()

  t.equal(state['cal-test-0'].showPastEvents, true,
    'should toggle "showPastEvents" property on the Calendar with the corresponding id')
  t.notDeepEqual(state, initialState, 'should not mutate existing state')
  t.end()
})


test1(`On '${actions.showEventDetails().type}' action creator`, t => {
  const action = actions.showEventDetails('calendar-id', 'event-id')
  t.equal(action.payload.calendarId, 'calendar-id', 'it should create Action with property "calendarId"')
  t.equal(action.payload.eventId, 'event-id', 'it should create Action with property "eventId"')
})



test1(`On '${actions.showEventDetails().type}' action`, t => {
  const store = createStore(calendarsReducer, {
    ['cal-test-0']: {
      eventDetailsModal: {
        isOpen: false,
        eventId: undefined,
      },
    }
  })
  const initialState = store.getState()
  const action = actions.showEventDetails('cal-test-0', 'evt-test-9')

  store.dispatch(action)

  const state = store.getState()
  const calendar = state['cal-test-0']

  t.equal(calendar.eventDetailsModal.isOpen, true,
    'should change "eventDetails.isOpen" property on the Calendar with the corresponding id to true')
  t.equal(calendar.eventDetailsModal.eventId, action.payload.eventId,
    'should change "eventDetails.eventId" property to the value from action')
  t.notDeepEqual(state, initialState, 'should not mutate existing state')
  // t.notEqual(calendar, initialState['cal-test-0'], 'should not mutate nested state')
})
