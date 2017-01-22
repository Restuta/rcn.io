/* when


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule shallowEqual
 * @typechecks
 * @flow
 */

/*eslint-disable no-self-compare */
/*eslint-disable no-console */


const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return (x !== 0 || 1 / x === 1 / y)
  } else {
    // Step 6.a: NaN == NaN
    return (x !== x && y !== y)
  }
}

/**
 * This code is almost identical to React's built-in shallow equal function, which performs shallow equality by
 * iterating through keys on an object and returning false when any key has values which are not strictly equal
 * between the arguments, but with support of props to be ignored.
 * Returns true when the values of all keys are strictly equal.
 * exceptProps is an object of the form {exceptProps: []} listing names of the props to be ignored
 */
function shallowEqual(objA, objB, except = {exceptProps: []}) {
  if (is(objA, objB)) {
    return true
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false
  }

  let keysA = Object.keys(objA)
  let keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`shallowEqual: number of props is different, keysA: ${keysA.length}, keysB: ${keysB.length}`)
    }

    return false
  }

  if (except && except.exceptProps && except.exceptProps.length > 0) {
    keysA = keysA.filter(key => !except.exceptProps.includes(key))
    keysB = keysB.filter(key => !except.exceptProps.includes(key))
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i])
      || !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`shallowEqual: non-equal props – "${keysA[i]}"`)
        console.warn(`shallowEqual: "objA.${keysA[i]}=${JSON.stringify(objA[keysA[i]])}"`)
        console.warn(`shallowEqual: "objB.${keysA[i]}=${JSON.stringify(objB[keysA[i]])}"`)
      }
      return false
    }
  }

  return true
}

export default shallowEqual
