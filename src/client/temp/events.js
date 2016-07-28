/* returns list of evnets, this is temporarely till we get a server setup */

//import rawEvents from 'temp/data/2015-road.js'
import rawRoadEvents from 'client/temp/data/2016-NCNCA-road.js'
import rawMtbEvents from 'client/temp/data/2016-mtb.js'
import rawMtbEventsManual from 'client/temp/data/2016-mtb-manual.js'
import moment from 'moment'
//import { rnd } from 'client/shared/utils'

const Disciplines = {
  MTB: 'MTB',
  Road: 'Road'
}

const Statuses = {
  Cancelled: 'Cancelled',
  Moved: 'Moved'
}

const preProcessUrl = (rawUrl) => {
  if (rawUrl) {
    if (rawUrl.startsWith('http') || rawUrl.startsWith('https')) {
      return rawUrl
    } else {
      return 'http://' + rawUrl
    }
  } else {
    return ''
  }
}

const hash = (str) =>  str.split('').reduce((prevHash, currVal) =>
    ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0)

const createEvent = rawEvent => {
  const name = rawEvent.name.replace(/--/g, '—')
  const date = moment(rawEvent.date, 'MMMM DD YYYY')
  const datePlain = date.format('MMDDYYYY')
  //TODO bc: handle multi-day events, currently some events have same id this screws our selectors since calendar has list of ids
  /*
    PROPOSED solution:
      defenitely there must be one evnet for one id, but then it may have array of dates
      if the event got moved it should have a link to event id that got created in place of it
  */


  //TODO bc: revisit this, add ids?,
  const eventId = 'evt-' + hash(name) + '-' + datePlain

  return {
    id: eventId,
    name: name,
    date: date,
    datePlain: datePlain,
    type: rawEvent.type,
    discipline: rawEvent.discipline,
    location: rawEvent.location || {},
    promoterUrl: preProcessUrl(rawEvent.promoterUrl),
    flyerUrl: preProcessUrl(rawEvent.flyerUrl),
    status: rawEvent.status
  }
}

const preProcessEvents = rawEvents =>
  rawEvents.map(rawEvent => createEvent(rawEvent))


const allMtbEvents = rawMtbEvents.concat(rawMtbEventsManual)
const norcalMtb2016Events = preProcessEvents(allMtbEvents)

const testRoadEvents2016 = preProcessEvents(rawRoadEvents)

export {
  Disciplines,
  Statuses,
  testRoadEvents2016,
  norcalMtb2016Events,
}
