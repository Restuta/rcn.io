import moment from 'moment'
import { generateShortId } from 'client/utils/math'
import { getAbbreviatedType } from 'client/calendar/events/types'

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
//
// const createEventIdPrefix = (eventDate, eventType) => (
//   `evt-ncnca-${eventDate.year()}-${eventDate.format('MMM').toLowerCase()}-${eventDate.format('DD')}`
//     + `-${getAbbreviatedType(eventType || 'Road')}`
// )
//
// const createDraftEventId = (eventDate, eventType) => (
//   createEventIdPrefix(eventDate, eventType) + `-${shortId}`
// )

// const createEventId = (eventDate, eventType) =>

const transformEvents = googleSpreedsheetEvents =>
  googleSpreedsheetEvents.map(event => {
    if (!event['Race Name'] || !event['Race Name'].trim()) {
      return null
    }

    //TODO bc: handle notable events as separate events? (it's a property now)

    const date = moment(event['Date'], 'MM/DD/YYYY')
    const name = event['Race Name'].trim()
    const shortId = generateShortId({length: 3})
    const type = event['Type'].trim()

    return {
      id: `evt-ncnca-${date.year()}-${date.format('MMM').toLowerCase()}-${date.format('DD')}`
        + `-${getAbbreviatedType(type || 'Road')}-${shortId}`,
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


//use this funciton to convert draft events to non draft ones, should be donce once per year when draft
//calendar is done and NCNCA is ready to release official one
// const convertDraftEventsToRealOnes = transformedDraftEvents =>
//   transformedDraftEvents.map(event => {
//     return {
//       ...event,
//       isDraft: false
//     }
//   })


// fetch NCNCA Draft events from google spreeadshet
// (https://docs.google.com/spreadsheets/d/1Dj5IHa-ym4IpaKyMrIz9veXzuW_yPGtfqxhtwxdMO8E/edit#gid=937034132)
// using sheetsu.com
const fetchRawNcncaDraftEvents2017 = () =>
  fetch('https://sheetsu.com/apis/v1.0/1c20d0db4562')
    .then(response => response.json())
    .then(events => transformEvents(events))
    // .then(events => {
    //   console.log(JSON.stringify(events))
    //   return events
    // })
    // .then(parsedEvents => parsedEvents.map(x => console.info(x.name)))

export default fetchRawNcncaDraftEvents2017
