console.log('Hello Anton ;) 🐱');

var eventData = [
  {
    "date": "January 31st 2015",
    "name": "Cal Aggie Criterium"
  }
  // },{
  //   "date": "February 7th 2015",
  //   "name": "John C. Schlesinger Memorial Circuit Race and Team Time Trial"
  // },{
  //   "date": "February 8th 2015",
  //   "name": "RED KITE OMNIUM EVENT #1 - THE BUMP CIRCUIT RACE (WINTER)"
  // }
];
var disciplineData = ["Road", "MTB", "Track", "Cyclocross", "Clinic"];
var typeData = ["Road Race", "Criterium", "Cyclocross", "Time Trial", "Cross Country", "Cross Country Marathon", "Downhill", "Dual Slalom", "Short Track Cross Country", "Super D", "Points Race", "Scratch Race", "Individual Pursuit", "Sprint", "Keirin"];
var timeData = ["8:00 AM", "8:30 AM", "9:00 AM", "9:20 AM", "10:00 AM", "10:15 AM", "11:40 AM", "12:00 PM", "12:03 PM", "1:00 PM", "1:55 PM", "2:00 PM", "2:18 PM"];

var fullEventData = eventData.map(function(element){
    var newObject = {
        id: "evt-" + getRandomNumber(1000, 9999),
        discipline: getRandomDiscipline(),
        type: getRandomType(),
        name: element.name,
        date: element.date,
        distanceMi: getRandomNumber(1, 200) + " Mi",
        durationMin: getRandomNumber(5, 180) + " Min",
        elevationGainFt: getRandomNumber(0, 2000) + " ft",
        startTime: getRandomTime(),
        //promoter: getRandomPromoter(),
        // location: {
        //    streetAddress: getRandomStreet(),
        //    city: getRandomCity(),
        //    state: "CA",
        //    zip: "9" + getRandomNumber(1000, 9999)
        // },
        distanceToEventMi: getRandomNumber(1, 200) + " Mi",
        estimatedTravelTime: getRandomNumber(1, 5) + " h",
        flyerUrl: "http://www.ncnca.org/sites/default/files/01/01/2014%20-%202%3A29am/183%20San%20Bruno%20Mountain%20Hill%20Climb%20OKED%203.pdf",
        registrationUrl: "https://www.usacycling.org/register/2014-183"
    };
    return newObject;
});
console.log(fullEventData);

function getRandomNumber(startNumber, endNumber){
    return Math.floor((Math.random() * endNumber) + startNumber);
};
 
function getRandomDiscipline(){
    return disciplineData[getRandomNumber(0,disciplineData.length)];
};
function getRandomType(){
    return typeData[getRandomNumber(0,typeData.length)];
};
function getRandomTime(){
    return timeData[getRandomNumber(0,timeData.length)];
}

