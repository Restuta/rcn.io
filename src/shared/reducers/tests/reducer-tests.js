import { createTest } from 'tests/test-utils.js'
import { createStore } from 'redux'
import {
  debug as debugReducer,
  calendars as calendarsReducer,
  getEventsByDateForCalendar,
} from 'shared/reducers/reducer.js'

import * as actions from 'shared/actions/actions.js'
import moment from 'moment'

const test = createTest('Reducer')

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
    'should toggle "showPastEvents" property on the Calendar with the corresponding Id')
  t.notDeepEqual(state, initialState, 'should not mutate existing state')
  t.end()
})

test1('getEventsByDateForCalendar selector, should create a map of events by date using provided Calendar Id', t => {
  const date1 = moment('2015-05-05')
  const date2 = moment('2016-06-06')
  const date3 = moment('2016-07-07')
  const state = {
    calendars: {
      ['cal-1'] : {
        eventsIds: ['evt-2', 'evt-3']
      }
    },
    events: {
      'evt-1': { id: 'evt-1', date: date1 },
      'evt-2': { id: 'evt-2', date: date2 },
      'evt-3': { id: 'evt-3', date: date3 },
    }
  }
  const props = {
    calendarId: 'cal-1'
  }

  const eventsByDate = getEventsByDateForCalendar(state, props)

  const event2Key = date2.format('MMDDYYYY')
  const event3Key = date3.format('MMDDYYYY')
  t.equal(eventsByDate.map.get(event2Key)[0].id, 'evt-2', 'it should contain first event')
  t.equal(eventsByDate.map.get(event3Key)[0].id, 'evt-3', 'it should contain second event')

  t.equal(eventsByDate.total, 2, 'it should also return total number of events')
})
