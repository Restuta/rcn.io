/* returns list of evnets, this is temporarely till we get a server setup */

import rawEvents from 'temp/data/2015-road.js'
import moment from 'moment'

class Event {
  constructor({name, date, type}) {
    this.name = name
    this.date = date
    this.type = type
  }
}

const events = rawEvents.map(rawEvent => {
  return new Event({
    name: rawEvent.name,
    date: moment(rawEvent.date, 'MMMM DD YYYY'),
    type: rawEvent.type
  })
})


export default events
