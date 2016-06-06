import test from 'tape'
import { createStore } from 'redux'
import { debug as debugReducer } from 'shared/reducers/reducer.js'
import {
  toggleBaseline,
  toggle3x3Grid,
  toggleContainerEdges,
} from 'shared/actions/actions.js'

//simplifies test when you need only one assertion
function test1(name, testBody) {
  return test(name, t => {
    t.plan(1)
    testBody(t)
  })
}

test1(`On '${toggleBaseline().type}' action, 'showBaseline' property should be changed to the opposite`, t => {
  const store = createStore(debugReducer, {showBaseline: true})
  let orignalState = store.getState()

  store.dispatch(toggleBaseline())

  let state = store.getState()
  t.equal(state.showBaseline, !orignalState.showBaseline)
})

test1(`On '${toggle3x3Grid().type}' action, 'show3x3Grid' property should be changed to the opposite`, t => {
  const store = createStore(debugReducer, {show3x3Grid: true})
  let orignalState = store.getState()

  store.dispatch(toggle3x3Grid())

  let state = store.getState()
  t.equal(state.show3x3Grid, !orignalState.show3x3Grid)
})

test1(`On '${toggleContainerEdges().type}' action, 'showContainerEdges' property should be changed to the opposite`, t => {
  const store = createStore(debugReducer, {showContainerEdges: true})
  let orignalState = store.getState()

  store.dispatch(toggleContainerEdges())

  let state = store.getState()
  t.equal(state.showContainerEdges, !orignalState.showContainerEdges)
})
