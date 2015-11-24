const disciplineData = ["Road", "MTB", "Track", "Cyclocross", "Clinic"];
//it's actually discipline specific, but we don't care for now
const typeData = [
  "Road Race",
  "Criterium",
  "Cyclocross",
  "Time Trial",
  "Cross Country",
  "Cross Country Marathon",
  "Downhill",
  "Dual Slalom",
  "Short Track Cross Country",
  "Super D",
  "Points Race",
  "Scratch Race",
  "Individual Pursuit",
  "Sprint",
  "Keirin"
];
const timeData = ["8:00 AM", "8:30 AM", "9:00 AM", "9:20 AM", "10:00 AM", "10:15 AM", "11:40 AM", "12:00 PM", "12:03 PM", "1:00 PM", "1:55 PM", "2:00 PM", "2:18 PM"];
const promoterData = [
  "2 Wheel Racing",
  "Alta Alpina Cycling Club",
  "Alto Velo",
  "AntiGravity Cycling",
  "Back of Nowhere Enterprises",
  "Berkeley Bicycle Club",
  "Bicycle Planet",
  "Bicycles Plus",
  "Bike Monkey",
  "Bike Station Aptos",
  "Brian Joder",
  "Bubba Melcher",
  "Cal Aggie Cycling",
  "Cal Cycling",
  "California Giant Cycling Team",
  "CCCX (Central Coast Cyclocross)",
  "Central Sierra Cyclists",
  "Chico Corsa Cycling Club",
  "China Peak Mountain Resort"
];
const streetData = ["Kearny Street", "Mission Street", "Polk Street", "Stockton Street", "Union Street", "Third Street", "22nd Street", "49-Mile Scenic Drive", "Alemany Boulevard", "Broadway",
  "Castro Street", "The Embarcadero", "Filbert Street", "Great Highway", "Haight Street", "Montgomery Street", "New Montgomery Street", "Octavia Boulevard", "Skyline Boulevard", "Vermont Street", "Howard Street"
];
const cityData = ["Ross", "Sacramento", "St. Helena", "Salinas", "San Anselmo", "San Bernardino", "San Bruno", "San Carlos", "San Clemente", "San Diego", "San Dimas", "San Fernando", "San Francisco", "San Gabriel",
  "San Jacinto", "San Joaquin", "San Jose", "San Juan Bautista", "San Juan Capistrano", "San Leandro"
];

//real events extracted from USA Cycling for 2015
const eventData = [{
  "date": "January 31st 2015",
  "name": "Cal Aggie Criterium"
}, {
  "date": "February 7th 2015",
  "name": "John C. Schlesinger Memorial Circuit Race and Team Time Trial"
}, {
  "date": "February 8th 2015",
  "name": "RED KITE OMNIUM EVENT #1 - THE BUMP CIRCUIT RACE (WINTER)"
}, {
  "date": "February 8th 2015",
  "name": "Christopher Castro Memorial Road Race "
}, {
  "date": "February 14th 2015",
  "name": "Folsom Winter Criterium"
}, {
  "date": "February 15th 2015",
  "name": "Pine Flat Road Race"
}, {
  "date": "February 16th 2015",
  "name": "Dinuba Criterium"
}, {
  "date": "February 21st 2015",
  "name": "Snelling Road Race"
}, {
  "date": "February 21st 2015",
  "name": "UC Santa Cruz Slugapalooza"
}, {
  "date": "February 22nd 2015",
  "name": "Original Merced Criterium"
}, {
  "date": "February 27th 2015",
  "name": "Chico Stage Race p/b Sierra Nevada Brewing Co."
}, {
  "date": "March 6th 2015",
  "name": "Madera County Stage Race"
}, {
  "date": "March 8th 2015",
  "name": "RED KITE OMNIUM EVENT #2 - RED KITE CRITERIUM (MARCH)"
}, {
  "date": "March 14th 2015",
  "name": "Wards Ferry Road Race"
}, {
  "date": "March 21st 2015",
  "name": "UC Merced Race Weekend"
}, {
  "date": "March 22nd 2015",
  "name": "RED KITE OMNIUM EVENT #3 - TEMPUS FUGIT INDIVIDUAL TIME TRIAL (SP"
}, {
  "date": "March 22nd 2015",
  "name": "Chowcilla Criterium"
}, {
  "date": "March 28th 2015",
  "name": "Fresno State Road Race Weekend"
}, {
  "date": "March 28th 2015",
  "name": "Turlock lake Road Race"
}, {
  "date": "March 29th 2015",
  "name": "Santa Cruz Classic Criterium"
}, {
  "date": "April 4th 2015",
  "name": "Copperopolis Road Race"
}, {
  "date": "April 19th 2015",
  "name": "RED KITE OMNIUM EVENT #4 - RED KITE CRITERIUM (APRIL)"
}, {
  "date": "April 25th 2015",
  "name": "WCCC Championships p/b Cal Cycling"
}, {
  "date": "April 25th 2015",
  "name": "Clovis Hills Criterium"
}, {
  "date": "April 26th 2015",
  "name": "Budweiser Sequoia Cycling Classic"
}, {
  "date": "April 26th 2015",
  "name": "Wente Vineyards Classic Road Race"
}, {
  "date": "May 2nd 2015",
  "name": "Mike's Bikes 42 nd Cat’ s Hill Classic "
}, {
  "date": "May 2nd 2015",
  "name": "Golden State Race Series"
}, {
  "date": "May 3rd 2015",
  "name": "Salinas Criterium"
}, {
  "date": "May 3rd 2015",
  "name": "Calaveras Time Trial "
}, {
  "date": "May 8th 2015",
  "name": "Tour of California Women's Edition "
}, {
  "date": "May 8th 2015",
  "name": "Honor Ride Lake Tahoe"
}, {
  "date": "May 9th 2015",
  "name": "Berkeley Hills Road Race"
}, {
  "date": "May 10th 2015",
  "name": "RED KITE OMNIUM EVENT #6 - RED KITE CRITERIUM (MAY)"
}, {
  "date": "May 15th 2015",
  "name": "Mariposa Women's Stage Race "
}, {
  "date": "May 23rd 2015",
  "name": "Death Valley Road Omnium"
}, {
  "date": "May 23rd 2015",
  "name": "Folsom Classic Criterium"
}, {
  "date": "May 25th 2015",
  "name": "Memorial Day Criterium"
}, {
  "date": "May 30th 2015",
  "name": "IC3 Dash for Cash"
}, {
  "date": "May 31st 2015",
  "name": "RED KITE OMNIUM EVENT #7 - THE BUMP CIRCUIT RACE (SPRING)"
}, {
  "date": "June 6th 2015",
  "name": "Pescadero Coastal Classic & Elite District Championship"
}, {
  "date": "June 20th 2015",
  "name": "RED KITE OMNIUM EVENT #8 - TRI-VALLEY CRITERIUM CLASSIC"
}, {
  "date": "June 21st 2015",
  "name": "55th Annual Nevada City Bicycle Classic"
}, {
  "date": "December 1st 2015",
  "name": "2015 USA Cycling Amateur Road Nationals"
}, {
  "date": "June 28th 2015",
  "name": "The Parnassus Investments Burlingame Criterium"
}, {
  "date": "July 4th 2015",
  "name": "Davis Bike Club 4th of July Criterium"
}, {
  "date": "July 5th 2015",
  "name": " Lodoga Road Race (Formerly Leesville)"
}, {
  "date": "July 11th 2015",
  "name": "Northern CA/NV District Championships"
}, {
  "date": "July 12th 2015",
  "name": "RED KITE OMNIUM EVENT #9 - RED KITE CRITERIUM (JULY)"
}, {
  "date": "July 25th 2015",
  "name": "San Rafael Twilight Criterium"
}, {
  "date": "July 26th 2015",
  "name": "RED KITE OMNIUM EVENT #11 - 31st ANNUAL BERKELEY BICYCLE CLUB CRITERIU"
}, {
  "date": "August 9th 2015",
  "name": "RED KITE OMNIUM EVENT #12 - RED KITE CRITERIUM (AUGUST)"
}, {
  "date": "August 15th 2015",
  "name": "Dunnigan Hills Road Race"
}, {
  "date": "August 23rd 2015",
  "name": "RED KITE OMNIUM EVENT #13 - TEMPUS FUGIT INDIVIDUAL TIME TRIAL (S"
}, {
  "date": "August 23rd 2015",
  "name": "University Road Race"
}, {
  "date": "August 29th 2015",
  "name": "Winters Road Race"
}, {
  "date": "August 30th 2015",
  "name": "Vacaville Gran Prix"
}, {
  "date": "September 5th 2015",
  "name": "RED KITE CHAMPIONSHIP WEEKEND - RED KITE OMNIUM AND NCNCA STATE CRITER"
}, {
  "date": "September 7th 2015",
  "name": "Giro Di San Francisco"
}, {
  "date": "September 12th 2015",
  "name": "52nd Mt. Tamalpais Hill Climb"
}, {
  "date": "September 20th 2015",
  "name": "Fremont Peak Hill CLimb"
}, {
  "date": "September 20th 2015",
  "name": "Oakland Grand Prix"
}, {
  "date": "September 26th 2015",
  "name": "Henleyville Road Race"
}, {
  "date": "September 27th 2015",
  "name": "Esparto Time Trial"
}, {
  "date": "October 10th 2015",
  "name": "Crush Challenge presented by Amgen"
}, {
  "date": "October 11th 2015",
  "name": "Dylan's 2015 Ride "
}];

export default {
  eventData,
  disciplineData,
  typeData,
  timeData,
  promoterData,
  streetData,
  cityData
};
