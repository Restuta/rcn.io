const log = require('server/utils/log')
const { flow, map } = require('lodash/fp')
const usac2017CnRoadEvensRaw = require('../raw/2017-CN-road')
const { createShortEventId, createPrettyEventId } = require('shared/events/gen-event-id.js')
const { parseDate, parseLocation, parseDiscipline } = require('./parsers')

log.debug(usac2017CnRoadEvensRaw.length)

const convertToInternalFormat = rawUsacEvent => {
  const shortId = createShortEventId()

  try {
    const rcnEvent = {
      id: createPrettyEventId(rawUsacEvent.year, rawUsacEvent.name, 'usac', shortId),
      _shortId: shortId,
      name: rawUsacEvent.name,
      date: parseDate(rawUsacEvent.dates),
      discipline: parseDiscipline(rawUsacEvent.discipline),
      location: parseLocation(rawUsacEvent.location),
      usacPermit: rawUsacEvent.permit,
      usac: {
        status: rawUsacEvent.status,
        category: rawUsacEvent.usacCategory,
        type: rawUsacEvent.usacEventType
      }
    }

    return rcnEvent
  } catch (e) {
    log.error(e)
    log.error('Failed to parse event: ')
    log.error(rawUsacEvent)
  }
}


// main processing pipeline
const processEvents = flow(
  map(convertToInternalFormat)
  // , map(log.debug)
  // ,map(validateOverSchema)
)

const processedEvents = processEvents(usac2017CnRoadEvensRaw)
log.debug('done!')


const { uniq } = require('lodash/fp')
log.path(uniq, 'discipline', processedEvents)


// 54.227.184.196
// 34.224.64.25
//  54.227.184.196
