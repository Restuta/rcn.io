const log = require('server/utils/log')
const { flow, map, trim, partial } = require('lodash/fp')
const usac2017CnRoadEvensRaw = require('../raw/2017-USAC-CN-road.json')
const { createShortEventId, createPrettyEventId } = require('shared/events/gen-event-id')
const { parseDate, parseLocation, parseDiscipline, parseType, parsePromoter } = require('./parsers')

const Joi = require('joi')
const schema = require('client/temp/data/tests/event-schema')

const { writeJsonToFile } = require('./file-utils')
const path = require('path')

const convertToInternalFormat = rawUsacEvent => {
  const shortId = createShortEventId()

  try {
    const discipline = parseDiscipline(rawUsacEvent.discipline)

    const rcnEvent = {
      id: createPrettyEventId(rawUsacEvent.year, rawUsacEvent.name, 'usac', shortId),
      _shortId: shortId,
      name: trim(rawUsacEvent.name),
      date: parseDate(rawUsacEvent.dates),
      discipline: discipline,
      type: parseType({
        nameRaw: rawUsacEvent.name,
        discipline: discipline,
        competitive: rawUsacEvent.competitive
      }),
      location: parseLocation(rawUsacEvent.location),
      usacPermit: trim(rawUsacEvent.permit),
      usac: {
        status: trim(rawUsacEvent.status),
        category: trim(rawUsacEvent.usacCategory),
        type: trim(rawUsacEvent.usacEventType)
      },
      websiteUrl: trim(rawUsacEvent.eventWebSite),
      promoters: parsePromoter(rawUsacEvent.promoter),
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

log.debug(__dirname)

// main processing pipeline
const processEvents = flow(
  map(convertToInternalFormat),
  // , map(log.debug)
  map(validateOverSchema),
  partial(writeJsonToFile, [path.resolve(__dirname, '../../../../client/temp/data/2017-usac-events.json')])
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
