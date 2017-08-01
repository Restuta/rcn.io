/* eslint-disable no-console */
const chalk = require('chalk')
const util = require('util')
const { isString, identity, get, flow, map } = require('lodash/fp')

const inspect = msg => util.inspect(msg, { depth: 4, colors: true })

const log = (msg, color) => {
  if (isString(msg)) {
    console.info(chalk[color](msg))
  } else {
    console.info(chalk[color](inspect(msg)))
  }
}


const error = msg => log(msg, 'red')
const debug = msg => log(msg, 'blue')

/**
 * Logs all values from the given path for given iterable.
 * @param {[type]} extraProcessingFunc [Optinal function do pre-processing of the given iterable
 * before logging]
 * @param {[type]} path [Object path to log]
 * @param {[type]} iterable [Iterable that can be "mapped over"]
 * @returns {[type]} [-]
 */
const path = (extraProcessingFunc = identity, path, iterable) =>
  flow(
    map(event => get(path, event)),
    extraProcessingFunc,
    map(debug)
  )(iterable)

module.exports = {
  debug,
  error,
  inspect,
  path
}
