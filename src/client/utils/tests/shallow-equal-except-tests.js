import { createTest } from 'tests/test-utils'
import shallowEqualExcept from '../shallow-equal-except'

const test = createTest('Utils: Shallow Equal Except')

test('when passed equal objects', t => {
  const objA = {x: 1}
  const objB = objA
  const result = shallowEqualExcept(objA, objB)

  t.ok(result, 'should return true')
  t.end()
})

test('when passed non-equal objects with equal props', t => {
  const objA = {x: 1}
  const objB = {x: 1}
  const result = shallowEqualExcept(objA, objB)

  t.ok(result, 'should return true')
  t.end()
})

test('when passed non-equal objects, with non-equal props', t => {
  const objA = {x: 1, y: {a: 'a'}} //it would be fine to use just {}, but adding explicit props makes it more obvious that objects are not equal
  const objB = {x: 1, y: {b: 'b'}}
  const result = shallowEqualExcept(objA, objB)

  t.notOk(result, 'should return false')
  t.end()
})


test('when passed non-equal objects, with non-equal props and excluding props that are non-equal', t => {
  const objA = {x: 1, y: {}}
  const objB = {x: 1, y: {}}
  const result = shallowEqualExcept(objA, objB, {exceptProps: ['y']})

  t.ok(result, 'should return true')
  t.end()
})


test('when passed non-equal objects, with non-equal props and excluding empty props', t => {
  const objA = {x: 1, y: {}}
  const objB = {x: 1, y: {}}
  const result = shallowEqualExcept(objA, objB, {exceptProps: []})

  t.notOk(result, 'should return false')
  t.end()
})



/*

ignore: []

*/
