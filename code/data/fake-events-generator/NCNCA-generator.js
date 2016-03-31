import util from 'util';
import Data from '.original/NCNCA-2016-road-manual';

//console.log('Love you, Helen ;)');


var fullEventData = Data.eventData.map(function(event) {
  var newObject = {
    id: 'evt-' + getRandomNumber(10000000, 99999999),
    discipline: event.discipline,
    type: event.type,
    name: event.name,
    date: event.date,
    distanceMi: getRandomNumber(1, 200),
    durationMin: getRandomNumber(5, 180),
    elevationGainFt: getRandomNumber(0, 2000),
    startTime: getRandomTime(),
    promoter: getRandomPromoter(),
    permit: event.permit,
    location: {
      streetAddress: event.location.streetAddress,
      city: event.location.city,
      state: event.location.state,
      zip: event.location.zip
    },
    distanceToEventMi: getRandomNumber(1, 200),
    estimatedTravelTime: getRandomNumber(1, 5) + 'h',
    flyerUrl: 'http://www.ncnca.org/sites/default/files/01/01/2014%20-%202%3A29am/183%20San%20Bruno%20Mountain%20Hill%20Climb%20OKED%203.pdf',
    registrationUrl: 'https://www.usacycling.org/register/2014-183'
  };
  return newObject;
});

// console.log(util.inspect(fullEventData, {
//   colors: true
// }));

console.log(JSON.stringify(fullEventData, null, '  '));

function getRandomNumber(startNumber, endNumber) {
  return Math.floor((Math.random() * endNumber) + startNumber);
};

function getRandomTime() {
  return Data.timeData[getRandomNumber(0, Data.timeData.length)];
};

function getRandomPromoter() {
  return Data.promoterData[getRandomNumber(0, Data.promoterData.length)];
}
