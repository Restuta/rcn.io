import { createTest } from 'tests/test-utils'
import events from '../2017-ncnca-events'
import moment from 'moment'
import { EventTypes, Disciplines } from 'client/calendar/events/types'

//TODO: make this tests event centric or test-case centric?

const test = createTest('2017 NCNCA Events')


const getKeyByValue = (obj, value) => Object.keys(obj).filter(key => obj[key] === value)
const getFirstKeyByValue = (obj, value) => getKeyByValue(obj, value)[0]

const getObjectValues = obj => Object.keys(obj).map(x => obj[x])


test('Event must have short id as part of long id and separately as "_shortId" property', t => {
  events.forEach((event, i) => {
    const eventId = event.id
    const shortIdFromId = eventId.match(/[a-zA-Z0-9_$]+$/gm)[0] //matches part after last '-'

    t.equal(event._shortId, shortIdFromId,
      `#${event.name} "${event._shortId}" => "${shortIdFromId}"`)
  })

  t.end()
})

test('Event must have _shortId that only contains predefined characters', t => {
  events.forEach((event, i) => {
    const matches =  event._shortId.match(/[a-zA-Z0-9_$]+$/gm) //matches part after last '-'

    if (matches && matches.length === 1) {
      t.pass(`#${event._shortId} for event "${event.name}"`)
    } else {
      t.fail(`Problematic _shortId: "#${event._shortId}" for event "${event.name}"`)
    }
  })

  t.end()
})

test('Event must have id starting from "evt-ncnca-2017"', t => {
  events.forEach((event, i) => {
    t.ok(event.id.startsWith(('evt-ncnca-2017')),
      `${event.name}`)
  })

  t.end()
})

test('Event must have date in a format "MMMM DD YYYY"', t => {
  events.forEach((event, i) => {
    const date = moment(event.date, 'MMMM DD YYYY')
    t.ok(date.isValid(),
      `${event.name}`)
  })

  t.end()
})


test('Event with promoters', t => {
  events.forEach((event, i) => {
    t.comment(`${event.name}`)

    if (event.promoters) {
      t.ok(Array.isArray(event.promoters), 'promoters should be an array')

      if (event.promoters.length >= 1) {
        t.ok(event.promoters.every(x => x.id),
          'each promoter should have an id')

        t.ok(event.promoters.every(x => x.id && x.id.startsWith('prm-')),
          'each promoter\'s id should start from "prm-"')
      }
    }
  })

  t.end()
})


test('Each Event must have at least city and state sat in Location', t => {
  events.forEach((event, i) => {
    t.comment(`${event.name}`)
    t.ok(event.location, 'has location set')
    t.ok(event.location.city, 'has city set')
    t.ok(event.location.state, 'has state set')
  })

  t.end()
})


test('Each Event must have Type and Discipline set to one of the pre-defined ones', t => {
  const allDisciplines = getObjectValues(Disciplines)

  const getEventTypesForDiscipline = discipline => {
    const disciplineKey = getFirstKeyByValue(Disciplines, discipline)
    return getObjectValues(EventTypes[disciplineKey])
  }

  events.forEach((event, i) => {
    t.comment(`${event.name}`)
    t.ok(allDisciplines.includes(event.discipline),
      'should have discipline equal to one of the pre-defined ones')

    t.ok(getEventTypesForDiscipline(event.discipline).includes(event.type),
      'should have type set to one that corresponds to event\'s discipline'
      + `, current one is set to: "${event.type}" which is not part of "${event.discipline}" discipline`)
  })

  t.end()
})
