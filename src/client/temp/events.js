/* returns list of evnets, this is temporarely till we get a server setup */

//import rawEvents from 'temp/data/2015-road.js'
import rawRoadEvents from 'temp/data/2016-NCNCA-road.js'
import rawMtbEvents from 'temp/data/2016-mtb.js'
import rawMtbEventsManual from 'temp/data/2016-mtb-manual.js'
import moment from 'moment'

const Disciplines = {
  MTB: 'MTB',
  Road: 'Road'
}

class Event {
  constructor({name, date, type}) {
    this.name = name
    this.date = date
    this.type = type
  }
}

const preProcessEvents = function(rawRoadEvents) {
  const events = new Map()

  rawRoadEvents.forEach(rawEvent => {
    const event = new Event({
      name: rawEvent.name
        .replace(/--/g, '—'),
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

const roadEvents = preProcessEvents(rawRoadEvents)
const mtbEvents = preProcessEvents(rawMtbEvents.concat(rawMtbEventsManual))

export {
  roadEvents,
  mtbEvents,
  Disciplines
}
