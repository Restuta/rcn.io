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
  constructor({name, date, type, location}) {
    this.name = name
    this.date = date
    this.type = type
    this.location = location
  }
}

class Events {
  constructor({eventsMap, total}) {
    this.eventsMap = eventsMap
    this.total = total
  }
}

const countTotalEvents = (eventsMap) => {
  let count = 0
  eventsMap.forEach((value, key, map) => {
    count += value.length
  })

  return count
}

const preProcessEvents = function(rawEvents) {
  const events = new Map()

  rawEvents.forEach(rawEvent => {
    const event = new Event({
      name: rawEvent.name
        .replace(/--/g, '—'),
      date: moment(rawEvent.date, 'MMMM DD YYYY'),
      type: rawEvent.type,
      location: rawEvent.location || {}
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

const roadEventsMap = preProcessEvents(rawRoadEvents)
const roadEvents = new Events({
  eventsMap: roadEventsMap,
  total: countTotalEvents(roadEventsMap)
})

const mtbEventsMap = preProcessEvents(rawMtbEvents.concat(rawMtbEventsManual))
const mtbEvents = new Events({
  eventsMap: mtbEventsMap,
  total: countTotalEvents(mtbEventsMap)
})


export {
  Events,
  roadEvents,
  mtbEvents,
  Disciplines
}
