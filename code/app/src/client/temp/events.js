/* returns list of evnets, this is temporarely till we get a server setup */

//import rawEvents from 'temp/data/2015-road.js'
import rawEvents from 'temp/data/2016-NCNCA-road.js'
import moment from 'moment'

class Event {
  constructor({name, date, type}) {
    this.name = name
    this.date = date
    this.type = type
  }
}

const preProcessEvents = function(rawEvents) {
  const events = new Map()

  rawEvents.forEach(rawEvent => {
    const event = new Event({
      name: rawEvent.name.replace('--', '—'),
      date: moment(rawEvent.date, 'MMMM DD YYYY'),
      type: rawEvent.type
    })

    const key = event.date.format('MMDDYYYY')

    if (events.get(key)) {
      events.get(key).push(event)
    } else {
      events.set(key, [event])
    }
  })

  return events
}

const events = preProcessEvents(rawEvents)

export default events
