/* returns list of evnets, this is temporarely till we get a server setup */

//import rawEvents from 'temp/data/2015-road.js'
import rawRoadEvents from 'client/temp/data/2016-NCNCA-road-test'
import rawMtbEventsFromSpreadsheet from 'client/temp/data/2016-mtb'
import rawMtbEventsManual from 'client/temp/data/2016-mtb-manual'
import fetchRawNcncaDraftEvents2017 from 'client/temp/fetch-ncnca-draft-events-2017'
import moment from 'moment'
import { hash } from 'client/utils/math'

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

const createEvent = rawEvent => {
  const name = rawEvent.name.replace(/--/g, '—')
  const date = moment(rawEvent.date, 'MMMM DD YYYY')
  const datePlain = date.format('MMDDYYYY')

  //TODO bc: revisit this, add ids?,
  const eventId = 'evt-' + hash(name) + '-' + datePlain

  return {
    id: eventId,
    name: name,
    date: date,
    datePlain: datePlain,
    type: rawEvent.type,
    discipline: rawEvent.discipline,
    //TODO: add location name
    location: rawEvent.location || {},
    flyerUrl: preProcessUrl(rawEvent.flyerUrl),
    status: rawEvent.status,
    group: rawEvent.group, //group of event according to NCNCA planning document
    notes: rawEvent.notes,
    promoter: rawEvent.promoter,
    promoterName: rawEvent.promoterName,
    promoterUrl: preProcessUrl(rawEvent.promoterUrl),
    registrationUrl: preProcessUrl(rawEvent.registrationUrl)
  }
}

const preProcessEvents = rawEvents =>
  rawEvents.map(rawEvent => createEvent(rawEvent))
const rawMtbEvents = rawMtbEventsFromSpreadsheet.concat(rawMtbEventsManual)
const norcalMtb2016Events = preProcessEvents(rawMtbEvents)
const testRoadEvents2016 = preProcessEvents(rawRoadEvents)
const fetchNcncaDraftEvents2017 = () => fetchRawNcncaDraftEvents2017()
  .then(eventsRaw => preProcessEvents(eventsRaw))

export {
  testRoadEvents2016,
  norcalMtb2016Events,
  fetchNcncaDraftEvents2017,
}
