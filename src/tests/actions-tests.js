import test from 'tape'
import { createAction as makeActionCreator } from 'redux-actions'

test('When "redux-actions" is used to create ations', t => {
  const testAction = makeActionCreator('test-action', (id) => ({id}))
  const action = testAction('some ID')

  t.equal(action.payload.id, 'some ID', 'it should create Action with proper id')
  t.end()
})
