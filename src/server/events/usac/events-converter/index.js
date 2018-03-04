const log = require('server/utils/log')
const {
  flow,
  map,
  trim,
  partial,
  groupBy,
  find,
  first,
  filter,
  concat,
} = require('lodash/fp')
const usac2017CnRoadEvensRaw = require('../raw/2017-USAC-CN-road.json')
const { createShortEventId, createPrettyEventId } = require('shared/events/gen-event-id')
const {
  parseDate,
  parseLocation,
  parseDiscipline,
  parseType,
  parsePromoter,
} = require('./parsers')
const { Statuses } = require('@rcn/events-core/event-types')

const Joi = require('joi')
const schema = require('@rcn/events-core/event.schema')

const { writeJsonToFile } = require('./file-utils')
const path = require('path')

// TODO: check if file exists, if it doesn't assume all events are new
const relativePathToConvertedEvents = '../../../../client/temp/data/2017-usac-events.json'
const absolutePathToConvertedEvents = path.resolve(
  __dirname,
  relativePathToConvertedEvents
)
const previousEvents = require(relativePathToConvertedEvents)

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
      competitive: rawUsacEvent.competitive,
    }),
    location: parseLocation(rawUsacEvent.location),
    usacPermit: rawPermit,
    usac: {
      status: trim(rawUsacEvent.status),
      category: trim(rawUsacEvent.usacCategory),
      type: trim(rawUsacEvent.usacEventType),
    },
    websiteUrl: encodeURI(trim(rawUsacEvent.eventWebSite)),
    registrationUrl: encodeURI(trim(rawUsacEvent.registrationLink)),
    promoters: parsePromoter(rawUsacEvent.promoter),
  }
}

const createUpdatedEvent = (existingRcnEvent, rawUsacEvent) => {
  // TODO: implement support for moved events ^, basically we need to do extra pass and compare
  // if event with same permit got new date? if so, we would need to
  // - create a new event
  // - link old event to new one (movedToId)
  // - mark old one as moved
  return Object.assign(
    {},
    {
      id: existingRcnEvent.id,
      _shortId: existingRcnEvent._shortId,
    },
    createRcnEventPropsFromUsac(rawUsacEvent)
  )
}

const createNewEvent = rawUsacEvent => {
  const shortId = createShortEventId()

  log.cyan(`New event found "${rawUsacEvent.permit}: ${rawUsacEvent.name}"`)

  return Object.assign(
    {},
    {
      id: createPrettyEventId(rawUsacEvent.year, rawUsacEvent.name, 'usac', shortId),
      _shortId: shortId,
    },
    createRcnEventPropsFromUsac(rawUsacEvent)
  )
}

const convertUsacEventToRcnEvent = previousEventsByPermit => rawUsacEvent => {
  const existingRcnEvents = previousEventsByPermit[trim(rawUsacEvent.permit)]

  const existingRcnEvent = existingRcnEvents
    ? existingRcnEvents.length === 1
      ? first(existingRcnEvents)
      : // if multiple events, match by discipline, since ther ecould be same event for different disciplines
        find(
          x => x.discipline === parseDiscipline(rawUsacEvent.discipline),
          existingRcnEvents
        )
    : undefined

  if (existingRcnEvent && existingRcnEvent.length > 1) {
    log.error(
      'Found two existing events with same discipline and permit number, ' +
        'which means we should go to USAC and double-check WTF is going on. ' +
        'This could also mean that event has been moved to a different date ' +
        'and we need to add support for this.'
    )
    log.debug(existingRcnEvent)
  }

  try {
    const rcnEvent = existingRcnEvent
      ? createUpdatedEvent(existingRcnEvent, rawUsacEvent)
      : createNewEvent(rawUsacEvent)

    return rcnEvent
  } catch (e) {
    log.error(e)
    log.error('Failed to parse event: ')
    log.error(rawUsacEvent)
  }
}

const updateEventsThatAreNoLongerOnUsac = previousEvents => justConvertedEvents => {
  const justConvertedEventsByPermit = groupBy('usacPermit', justConvertedEvents)

  const eventsThatAreNoLongerOnUsac = flow(
    filter(event => !justConvertedEventsByPermit[event.usacPermit]),
    map(event =>
      Object.assign({}, event, {
        status: Statuses.canceled,
        cancelationReason:
          'Unknown, event is likely canceled, since it got removed from USAC website.',
      })
    )
  )(previousEvents)

  if (eventsThatAreNoLongerOnUsac.length > 0) {
    eventsThatAreNoLongerOnUsac.forEach(x => {
      log.yellow(`Removed event "${x.usacPermit}: ${x.name}" USAC, marking as Canceled`)
    })
  }

  return concat(justConvertedEvents, eventsThatAreNoLongerOnUsac)
}

const updateRegLinks = previousEvents => justConvertedEvents => {
  const previousEventsByPermit = groupBy('usacPermit', previousEvents)
  const getRegistrationUrl = (usacStatus, newRegUrl, prevRegUrl) => {
    if (usacStatus === 'Complete' && newRegUrl === '') {
      return prevRegUrl
    } else {
      return newRegUrl
    }
  }

  // for each just converted event figure out if reg-link has to be updated or not
  // since USAC removes reg links for completed events and we don't want that
  const processedEvents = justConvertedEvents.map(justConvertedEvent => {
    const [prevEvent] = previousEventsByPermit[justConvertedEvent.usacPermit] || []

    return prevEvent
      ? {
          ...justConvertedEvent,
          registrationUrl: getRegistrationUrl(
            justConvertedEvent.usac.status,
            justConvertedEvent.registrationUrl,
            prevEvent.registrationUrl
          ),
        }
      : justConvertedEvent
  })

  return processedEvents
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
const processEvents = previousEvents =>
  flow(
    map(convertUsacEventToRcnEvent(groupBy('usacPermit', previousEvents))),
    // , map(log.debug)
    updateEventsThatAreNoLongerOnUsac(previousEvents),
    updateRegLinks(previousEvents),
    map(validateOverSchema),
    // TODO bc: order events by date so we write them to disk in somewhat consistent order
    // only write to file in prod mode
    process.env.NODE_ENV === 'development'
      ? x => Promise.resolve(x)
      : partial(writeJsonToFile, [absolutePathToConvertedEvents])
  )

processEvents(previousEvents)(usac2017CnRoadEvensRaw).then(events => {
  log.green(`Converted ${usac2017CnRoadEvensRaw.length} events`)
})

// const { uniq } = require('lodash/fp')
// log.path(uniq, 'resultsUrl', processedEvents)
// log.path(x => x, 'type', processedEvents)

// log.path(uniq, 'promoter.club', usac2017CnRoadEvensRaw)

// 54.227.184.196
// 34.224.64.25
//  54.227.184.196
