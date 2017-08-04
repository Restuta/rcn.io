/* eslint-disable no-console */
const chalk = require('chalk')
const util = require('util')
const { isString, identity, get, flow, map } = require('lodash/fp')

const inspect = ({msg, colors = true}) => util.inspect(msg, { depth: 4, colors: colors })

const log = (msg, color) => {
  if (isString(msg)) {
    console.info(chalk[color](msg))
  } else {
    console.info(chalk[color](inspect({msg})))
  }
}


const error = msg => log(msg, 'red')
const debug = msg => log(msg, 'blue')
const cyan = msg => log(msg, 'cyan')
const magenta = msg => log(msg, 'magenta')
const info = msg => console.info(inspect({msg, colors: false}))

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
  cyan,
  magenta,
  error,
  info,
  inspect,
  path
}
