import moment from 'moment'
import { hash } from 'client/utils/math'
import { createEventIdPrefix } from 'shared/events/gen-event-id'


/*
Source Event format:
{
  Date: "1/1/2017",
  Race Name: "San Bruno Hill Climb",
  Type: "Hill Climb",
  Location : "Brisbane",
  Promoter: "Tommy Evans",
  Group: "1",
  Notable events: "Sunday - New Years Day",
  Notes: "",
  Promoter contact info: "Pen Velo, evans792@gmail.com",
  Promoted By: "Pen Velo"
}

Target:
{
  "id": "evt-103403373",
  "discipline": "Road",
  "type": "Hill Climb",
  "name": "San Bruno Hill Climb",
  "date": "January 1st 2016",
  "distanceMi": 161,
  "durationMin": 150,
  "elevationGainFt": 1117,
  "startTime": "9:20 AM",
  "promoter": "Cal Cycling",
  "permit": "2016-115",
  "location": {
    "streetAddress": "Guadalupe Canyon Parkway & Bayshore Blvd",
    "city": "Brisbane",
    "state": "CA",
    "zip": "94005"
  },
  "distanceToEventMi": 171,
  "estimatedTravelTime": "1h",
  "flyerUrl": "http://www.ncnca.org/sites/default/files/01/01/2014%20-%202%3A29am/183%20San%20Bruno%20Mountain%20Hill%20Climb%20OKED%203.pdf",
  "registrationUrl": "https://www.usacycling.org/register/2014-183"
}
*/

//uses hash of the name so id stays same unless name changes for more predictable draft identity
const createDraftEventId = (eventDate, eventName) => (
  createEventIdPrefix(eventDate.year(), eventName, 'ncnca') + `-${hash(eventName + eventDate)}`
)

const transformEvents = googleSpreedsheetEvents =>
  googleSpreedsheetEvents.map(event => {
    if (!event['Race Name'] || !event['Race Name'].trim()) {
      return null
    }

    //TODO bc: handle "notable events" as separate events? (it's a property now), meaning events like "Memorial Day"
      //or "Nationals"

    const name = event['Race Name'].trim()
    const date = moment(event['Date'], 'MM/DD/YYYY')

    if (!date.isValid()) {
      throw new Error(`Invalid date for Draft Event: ${name}, date: ${event['Date']}`)
    }

    const type = event['Type'].trim()
    const draftId = createDraftEventId(date, name)

    return {
      id: draftId,
      name: name,
      date: date.format('MMMM DD YYYY'),
      discipline: 'Road',
      type: type,
      location: {
        city: event['Location'],
        state: 'CA',
      },
      promoters: [{
        name: event['Promoted By'].trim() || undefined,
        contactName: event['Promoter'].trim() || undefined,
        contactInfo: event['Promoter contact info'].trim() || undefined,
      }],
      group: event['Group'].trim() || undefined,
      draftNotes: event['Notes'].trim() || undefined,
      isDraft: true
    }
  })
  .filter(x => !!x) //filters out null and undefined


// import convertDraftEventsToRealOnes from './convert-drafts-to-real-events'

// fetch NCNCA Draft events from google spreeadshet
// (https://docs.google.com/spreadsheets/d/1Dj5IHa-ym4IpaKyMrIz9veXzuW_yPGtfqxhtwxdMO8E/edit#gid=937034132)
// using sheetsu.com
const fetchRawNcncaDraftEvents2017 = () =>
  fetch('https://sheetsu.com/apis/v1.0/1c20d0db4562')
    .then(response => response.json())
    .then(events => transformEvents(events))
    // .then(events => convertDraftEventsToRealOnes(events))
    // .then(events => {
    //   console.info(JSON.stringify(events))
    //   return events
    // })

export default fetchRawNcncaDraftEvents2017
