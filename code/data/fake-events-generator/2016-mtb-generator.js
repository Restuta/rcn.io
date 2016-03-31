import util from 'util';
import Data from './original/2016-mtb';


var fullEventData = Data.eventData.map(function(event) {
  var newObject = {
    id: 'evt-' + getRandomNumber(10000000, 99999999),
    discipline: 'MTB',
    name: event.name,
    date: event.date,
    promoterUrl: event.promoterUrl,
    location: {
      city: event.locationCity,
      state: 'CA'
    }
  };
  return newObject;
});

// console.log(util.inspect(fullEventData, {
//   colors: true
// }));

console.log(JSON.stringify(fullEventData, null, '  '));

function getRandomNumber(startNumber, endNumber) {
  return Math.floor((Math.random() * endNumber) + startNumber);
}
