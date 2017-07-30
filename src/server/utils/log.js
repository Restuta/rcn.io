const chalk = require('chalk')
const util = require('util')

const inspect = msg => util.inspect(msg, { depth: 4, colors: true })

// eslint-disable-next-line
const debug = msg => console.info(
  chalk.blue(
    util.inspect(msg, { depth: 4, colors: true })
  )
)

module.exports = {
  debug,
  inspect
}
