import util from 'util';
import Data from './data';

//console.log('Love you, Helen ;)');


var fullEventData = Data.eventData.map(function(event) {
  var newObject = {
    id: 'evt-' + getRandomNumber(10000000, 99999999),
    discipline: getRandomDiscipline(),
    type: getRandomType(),
    name: event.name,
    date: event.date,
    distanceMi: getRandomNumber(1, 200),
    durationMin: getRandomNumber(5, 180),
    elevationGainFt: getRandomNumber(0, 2000),
    startTime: getRandomTime(),
    promoter: getRandomPromoter(),
    permit: getRandomPermit(),
    location: {
      streetAddress: getRandomNumber(1, 1999) + ' ' + getRandomStreet(),
      city: getRandomCity(),
      state: 'CA',
      zip: '9' + getRandomNumber(1000, 9999)
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

function getRandomDiscipline() {
  return Data.disciplineData[getRandomNumber(0, Data.disciplineData.length)];
};

function getRandomType() {
  return Data.typeData[getRandomNumber(0, Data.typeData.length)];
};

function getRandomTime() {
  return Data.timeData[getRandomNumber(0, Data.timeData.length)];
};

function getRandomPromoter() {
  return Data.promoterData[getRandomNumber(0, Data.promoterData.length)];
};

function getRandomStreet() {
  return Data.streetData[getRandomNumber(0, Data.streetData.length)];
};

function getRandomCity() {
  return Data.cityData[getRandomNumber(0, Data.cityData.length)];
}

function getRandomPermit() {
  return (new Date()).getFullYear() + '-' + getRandomNumber(1, 10000);
}
