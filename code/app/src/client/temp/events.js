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
  const events = {}

  //TODO: date is not enough
  rawEvents.forEach(rawEvent => {
    const event = new Event({
      name: rawEvent.name.replace('--', '—'),
      date: moment(rawEvent.date, 'MMMM DD YYYY'),
      type: rawEvent.type
    })

    const key = event.date.format('MMDDYYYY')

    if (events[key]) {
      events[key].push(event)
    } else {
      events[key] = [event]
    }
  })

  return events
}

const events = preProcessEvents(rawEvents)

export default events
