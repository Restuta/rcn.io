import test from 'tape'
import { createStore } from 'redux'
import {
  debug as debugReducer,
  calendars as calendarsReducer
  } from 'shared/reducers/reducer.js'
import {
  toggleBaseline,
  toggle3x3Grid,
  toggleContainerEdges,
  toggleShowPastEvents,
} from 'shared/actions/actions.js'

//simplifies test when you need only one assertion
function test1(name, testBody) {
  return test(name, t => {
    testBody(t)
    t.end()
  })
}

test1(`On '${toggleBaseline().type}' action, 'showBaseline' property should be changed to the opposite`, t => {
  const store = createStore(debugReducer, {showBaseline: true})
  const initialState = store.getState()

  store.dispatch(toggleBaseline())

  let state = store.getState()
  t.equal(state.showBaseline, !initialState.showBaseline)
})

test1(`On '${toggle3x3Grid().type}' action, 'show3x3Grid' property should be changed to the opposite`, t => {
  const store = createStore(debugReducer, {show3x3Grid: true})
  const initialState = store.getState()

  store.dispatch(toggle3x3Grid())

  let state = store.getState()
  t.equal(state.show3x3Grid, !initialState.show3x3Grid)
})

test1(`On '${toggleContainerEdges().type}' action, 'showContainerEdges' property should be changed to the opposite`, t => {
  const store = createStore(debugReducer, {showContainerEdges: true})
  const initialState = store.getState()

  store.dispatch(toggleContainerEdges())

  let state = store.getState()
  t.equal(state.showContainerEdges, !initialState.showContainerEdges)
})

test(`'${toggleShowPastEvents().type}' action`, t => {
  const store = createStore(calendarsReducer, {
    ['cal-test-0']: {
      showPastEvents: false
    }
  })

  const initialState = store.getState()

  store.dispatch(toggleShowPastEvents('cal-test-0'))
  const state = store.getState()

  t.equal(state['cal-test-0'].showPastEvents, true,
    'should toggle "showPastEvents" property on the Calendar with the corresponding id')
  t.notEqual(state, initialState, 'should not mutate existing state')
  t.notEqual(state['cal-test-0'], initialState['cal-test-0'], 'should not mutated nested state')
  t.end()
})
