import test from 'tape'
import { createStore } from 'redux'
import { calendar as calendarReducer } from 'shared/reducers/reducer.js'
import { debug as debugReducer } from 'shared/reducers/reducer.js'
import { showAllEvents, toggleBaseline, toggle3x3Grid } from 'shared/actions/actions.js'

//simplifies test when you need only one assertion
function test1(name, testBody) {
  return test(name, t => {
    t.plan(1)
    testBody(t)
  })
}


test1(`On '${showAllEvents().type}' action 'showAllEvents' should be changed to true`, t => {
  let store = createStore(calendarReducer)
  store.subscribe(() => {
    let state = store.getState()

    t.true(state.showAllEvents)
  })

  store.dispatch(showAllEvents())
})


test1(`On '${toggleBaseline().type}' action 'showBaseline' should be changed to the opposite`, t => {
  const store = createStore(debugReducer, {showBaseline: true})
  let orignalState = store.getState()

  store.dispatch(toggleBaseline())

  let state = store.getState()
  t.equal(state.showBaseline, !orignalState.showBaseline)
})

test1(`On '${toggle3x3Grid().type}' action 'toggle3x3Grid' should be changed to the opposite`, t => {
  const store = createStore(debugReducer, {show3x3Grid: true})
  let orignalState = store.getState()

  store.dispatch(toggle3x3Grid())

  let state = store.getState()
  t.equal(state.show3x3Grid, !orignalState.show3x3Grid)
})
