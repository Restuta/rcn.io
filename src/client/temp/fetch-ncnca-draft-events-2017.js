import moment from 'moment'

/*
Sourc Event format:
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

const transformEvents = googleSpreedsheetEvents =>
  googleSpreedsheetEvents.map(event => {
    if (!event['Race Name'] || !event['Race Name'].trim()) {
      return null
    }

    //TODO bc: handle notable events as separate events? (it's a property now)

    return {
      name: event['Race Name'].trim(),
      date: moment(event['Date'], 'MM/DD/YYYY').format('MMMM DD YYYY'),
      discipline: 'Road',
      type: event['Type'].trim(),
      location: {
        city: event['Location'],
        state: 'CA',
      },
      promoterName: event['Promoter'].trim() || undefined,
      promoter: event['Promoted By'].trim() || undefined,
      group: event['Group'].trim() || undefined,
      notes: event['Notes'].trim() || undefined,
    }
  })
  .filter(x => !!x)


// fetch NCNCA Draft events from google spreeadshet (https://docs.google.com/spreadsheets/d/1Dj5IHa-ym4IpaKyMrIz9veXzuW_yPGtfqxhtwxdMO8E/edit#gid=937034132)
// using sheetsu.com
const fetchRawNcncaDraftEvents2017 = () =>
  fetch('https://sheetsu.com/apis/v1.0/1c20d0db4562')
    .then(response => response.json())
    .then(events => transformEvents(events))
    // .then(parsedEvents => parsedEvents.map(x => console.info(x.name)))

export default fetchRawNcncaDraftEvents2017
