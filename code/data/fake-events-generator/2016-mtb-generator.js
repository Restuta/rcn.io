import util from 'util'
import md5 from 'md5'
import moment from 'moment'
import Data from './original/2016-mtb'


const fullEventData = Data.eventData.map(event => {
  //setting evnet id as hash of name and date so we can identify event as the same if id's are the same

  const eventId = md5(event.name + event.date)

  const newObject = {
    id: 'evt-' + eventId,
    discipline: 'MTB',
    name: event.name,
    date: moment(event.date, 'MM/DD/YYYY').format('MMMM DD YYYY'), //normalizing date
    promoterUrl: event.promoterUrl,
    location: {
      city: event.locationCity,
      state: 'CA'
    }
  }

  return newObject
});

// console.log(util.inspect(fullEventData, {
//   colors: true
// }));

console.log(JSON.stringify(fullEventData, null, '  '))

function getRandomNumber(startNumber, endNumber) {
  return Math.floor((Math.random() * endNumber) + startNumber)
}
