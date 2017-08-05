const log = require('server/utils/log')
const { flow, map, trim, partial, groupBy, find, first } = require('lodash/fp')
const usac2017CnRoadEvensRaw = require('../raw/2017-USAC-CN-road.json')
const { createShortEventId, createPrettyEventId } = require('shared/events/gen-event-id')
const { parseDate, parseLocation, parseDiscipline, parseType, parsePromoter } = require('./parsers')

const Joi = require('joi')
const schema = require('client/temp/data/tests/event-schema')

const { writeJsonToFile } = require('./file-utils')
const path = require('path')

// TODO: check if file exists, if it doesn't assume all events are new
const relativePathToConvertedEvents = '../../../../client/temp/data/2017-usac-events.json'
const absolutePathToConvertedEvents = path.resolve(__dirname, relativePathToConvertedEvents)
const previousEvents = require(relativePathToConvertedEvents)

const previousEventsByPermit = groupBy('usacPermit', previousEvents)

const createRcnEventPropsFromUsac = rawUsacEvent => {
  const rawPermit = trim(rawUsacEvent.permit)
  const discipline = parseDiscipline(rawUsacEvent.discipline)

  return {
    name: trim(rawUsacEvent.name),
    date: parseDate(rawUsacEvent.dates),
    discipline: discipline,
    type: parseType({
      nameRaw: rawUsacEvent.name,
      discipline: discipline,
      competitive: rawUsacEvent.competitive
    }),
    location: parseLocation(rawUsacEvent.location),
    usacPermit: rawPermit,
    usac: {
      status: trim(rawUsacEvent.status),
      category: trim(rawUsacEvent.usacCategory),
      type: trim(rawUsacEvent.usacEventType)
    },
    websiteUrl: trim(rawUsacEvent.eventWebSite),
    registrationUrl: trim(rawUsacEvent.registrationLink),
    promoters: parsePromoter(rawUsacEvent.promoter),
  }
}

const convertToInternalFormat = rawUsacEvent => {
  const existingRcnEvents = previousEventsByPermit[trim(rawUsacEvent.permit)]


  const existingRcnEvent = existingRcnEvents
    ? (existingRcnEvents.length === 1)
      ? first(existingRcnEvents)
      // if multiple events, match by discipline, since ther ecould be same event for different disciplines
      : find(x => x.discipline === parseDiscipline(rawUsacEvent.discipline), existingRcnEvents)
  : undefined

  // const existingRcnEvent = previousEventsByPermit[trim(rawUsacEvent.permit)]
  let rcnEvent

  if (existingRcnEvent && existingRcnEvent.length > 1) {
    log.error('array')
    log.debug(existingRcnEvent.length)
    // log.debug(previousEventsByPermit)
  }

  try {
    if (existingRcnEvent) {
      rcnEvent = Object.assign(
        {},
        {
          id: existingRcnEvent.id,
          _shortId: existingRcnEvent._shortId,
        },
        createRcnEventPropsFromUsac(rawUsacEvent)
      )
    } else {
      const shortId = createShortEventId()

      rcnEvent = Object.assign(
        {},
        {
          id: createPrettyEventId(rawUsacEvent.year, rawUsacEvent.name, 'usac', shortId),
          _shortId: shortId,
        },
        createRcnEventPropsFromUsac(rawUsacEvent)
      )
    }

    return rcnEvent
  } catch (e) {
    log.error(e)
    log.error('Failed to parse event: ')
    log.error(rawUsacEvent)
  }
}

const validateOverSchema = rcnEvent => {
  const { value: event, error } = Joi.validate(rcnEvent, schema)

  if (error) {
    // log.error(`${event.usacPermit} failed schema validaiton: ${error}`)
    throw new Error(`${event.usacPermit} failed schema validaiton: ${error}`)
  } else {
    // log.cyan(`${event.id} passed Joi schema validation`)
  }

  return rcnEvent
}

// main processing pipeline
const processEvents = flow(
  map(convertToInternalFormat),
  // , map(log.debug)
  map(validateOverSchema),
  // only write to file in prod mode
  (process.env.NODE_ENV === 'development'
    ? x => Promise.resolve(x)
    : partial(writeJsonToFile, [absolutePathToConvertedEvents])
  )
)

processEvents(usac2017CnRoadEvensRaw)
  .then(() => {
    log.green(`Converted ${usac2017CnRoadEvensRaw.length} events`)
  })

// log.debug(processEvents)

// const { uniq } = require('lodash/fp')
// log.path(uniq, 'resultsUrl', processedEvents)
// log.path(x => x, 'type', processedEvents)

// log.path(uniq, 'promoter.club', usac2017CnRoadEvensRaw)

// 54.227.184.196
// 34.224.64.25
//  54.227.184.196
