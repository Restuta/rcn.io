 /* eslint-disable no-console */
import ncnca2017Events from '../2016-ncnca-events'
import schema from './event-schema'
import Joi from 'joi'
import util from 'util'
const inspect = msg => util.inspect(msg, { depth: 4, colors: true })
// eslint-disable-next-line no-console
const debug = msg => console.log(inspect(msg))

import { createTest } from 'tests/test-utils'

const test = createTest('Validate evnets with Joi schema')

const eventsToValidate = ncnca2017Events

test('', t => {
  // events.forEach((event, i) => {
  //   t.ok(event.id.startsWith(('evt-ncnca-2017')),
  //     `${event.name}`)
  // })

  eventsToValidate
    .map(event => Joi.validate(event, schema))
    .map(validationResult => {
      const error = validationResult.error
      const event = validationResult.value

      if (error) {
        debug(error.details)
        t.fail(`${event.id} failed schema validaiton: ${error}`)
      } else {
        t.pass(`${event.id} passed Joi schema validation`)
      }

    })
    .filter(x => x)

  t.end()
})



// prettier-ignore
// const errors = eventsToValidate
//   .map(event => Joi.validate(event, schema))
//   .map(validationResult => {
//     const error = validationResult.error
//
//     if (error) {
//       debug(error.details)
//       return error
//     }
//     return undefined
//   })
//   .filter(x => x)
//
// console.log('')
// if (errors.length === 0) {
//   console.log(chalk.green(`All ${eventsToValidate.length} events are valid.`))
// } else {
//   console.log(chalk.red(`${errors.length} events failed validation.`))
// }
