import ncnca2017Events from '../2017-ncnca-events'
import schema from './event-schema'
import Joi from 'joi'
import util from 'util'
import chalk from 'chalk'
const inspect = msg => util.inspect(msg, { depth: 4, colors: true })
// eslint-disable-next-line no-console
const debug = msg => console.log(inspect(msg))

import { createTest } from 'tests/test-utils'

const test = crateTest('Validate evnets with Joi schema')

test('Event must have id starting from "evt-ncnca-2017"', t => {
  events.forEach((event, i) => {
    t.ok(event.id.startsWith(('evt-ncnca-2017')),
      `${event.name}`)
  })

  t.end()
})

const eventsToValidate = ncnca2017Events

// prettier-ignore
const errors = eventsToValidate
  .map(event => Joi.validate(event, schema))
  .map(validationResult => {
    const error = validationResult.error

    if (error) {
      debug(error.details)
      return error
    }
    return undefined
  })
  .filter(x => x)

console.log('')
if (errors.length === 0) {
  console.log(chalk.green(`All ${eventsToValidate.length} events are valid.`))
} else {
  console.log(chalk.red(`${errors.length} events failed validation.`))
}
