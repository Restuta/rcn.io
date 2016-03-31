//real MTB events extracted from googlespreadsheet for 2016
const eventData = [
  {
    "date": "1/17/2016",
    "name": "MTB Kickstart",
    "locationCity": "Folsom",
    "promoterUrl": "totalbodyfitness.com"
    },
  {
    "date": "1/31/2016",
    "name": "CCCX#1",
    "locationCity": "Fort Ord",
    "promoterUrl": "www.cccxcycling.com"
  }, {
    "date": "1/31/2016",
    "name": "MTB Classic",
    "locationCity": "Folsom",
    "promoterUrl": "totalbodyfitness.com"
  }, {
    "date": "2/6/2016",
    "name": "CCCX#2",
    "locationCity": "Fort Ord",
    "promoterUrl": "www.cccxcycling.com"
  }, {
    "date": "2/14/2016",
    "name": "MTB Challenge",
    "locationCity": "Folsom",
    "promoterUrl": "totalbodyfitness.com"
  }, {
    "date": "2/20/2016",
    "name": "CCCX#3",
    "locationCity": "Fort Ord",
    "promoterUrl": "www.cccxcycling.com"
  }, {
    "date": "2/27/2016",
    "name": "CCCX#4",
    "locationCity": "Toro Park",
    "promoterUrl": "www.cccxcycling.com"
  }, {
    "date": "2/28/2016",
    "name": "MTB Madness",
    "locationCity": "Folsom",
    "promoterUrl": "totalbodyfitness.com"
  }, {
    "date": "3/12/2016",
    "name": "CCCX#5",
    "locationCity": "Toro Park",
    "promoterUrl": "www.cccxcycling.com"
  }, {
    "date": "3/12/2016",
    "name": "The Real COOL Cycling Festical",
    "locationCity": "Cool",
    "promoterUrl": "https://www.facebook.com/events/433486130109485/"
  }, {
    "date": "3/13/2016",
    "name": "MTB Championship",
    "locationCity": "Folsom",
    "promoterUrl": "totalbodyfitness.com"
  }, {
    "date": "3/26/2016",
    "name": "CCCX#6",
    "locationCity": "Toro Park",
    "promoterUrl": "www.cccxcycling.com"
  }, {
    "date": "3/26/2016",
    "name": "Lake Sonoma XC",
    "locationCity": "Lake Sonoma",
    "promoterUrl": "www.bikemonkey.net"
  }, {
    "date": "4/2/2016",
    "name": "SoNoMas",
    "locationCity": "Lake Sonoma",
    "promoterUrl": "www.bikemonkey.net"
  }, {
    "date": "4/3/2016",
    "name": "Big Sandy Race",
    "locationCity": "Fresno",
    "promoterUrl": "http://bigsandyrace.com/"
  }, {
    "date": "4/3/2016",
    "name": "MTB Celebration",
    "locationCity": "Folsom",
    "promoterUrl": "totalbodyfitness.com"
  }, {
    "date": "4/10/2016",
    "name": "Napa Valley Dirt Classic",
    "locationCity": "Angwin",
    "promoterUrl": "http://web2.puc.edu/Pioneers/NVDC/"
  }, {
    "date": "4/10/2016",
    "name": "Nevada City Dirt Classic #1",
    "locationCity": "Nevada City",
    "promoterUrl": "http://ybonc.org/events/dirt-classic/"
  }, {
    "date": "4/14/2016",
    "name": "Sea Otter Classic",
    "locationCity": "Laguna Seca",
    "promoterUrl": "http://www.seaotterclassic.com/"
  }, {
    "date": "4/15/2016",
    "name": "Sea Otter Classic",
    "locationCity": "Laguna Seca",
    "promoterUrl": "http://www.seaotterclassic.com/"
  }, {
    "date": "4/16/2016",
    "name": "Sea Otter Classic",
    "locationCity": "Laguna Seca",
    "promoterUrl": "http://www.seaotterclassic.com/"
  }, {
    "date": "4/17/2016",
    "name": "Sea Otter Classic",
    "locationCity": "Laguna Seca",
    "promoterUrl": "http://www.seaotterclassic.com/"
  }, {
    "date": "4/30/2016",
    "name": "Lemurian Shasta Classic",
    "locationCity": "Redding",
    "promoterUrl": "http://shastalemurian.com/"
  }, {
    "date": "4/30/2016",
    "name": "Nevada City Dirt Classic #2",
    "locationCity": "Nevada City",
    "promoterUrl": "http://ybonc.org/events/dirt-classic/"
  }, {
    "date": "5/1/2016",
    "name": "Race Behind Bars #1",
    "locationCity": "Folsom",
    "promoterUrl": "http://www.racebehindbars.com/"
  }, {
    "date": "5/7/2016",
    "name": "CCCX#7",
    "locationCity": "Fort Ord",
    "promoterUrl": "www.cccxcycling.com"
  }, {
    "date": "5/13/2016",
    "name": "Free Beckwourth 8hr MTB Race",
    "locationCity": "Beckwourth",
    "promoterUrl": "northlanderevents.com"
  }, {
    "date": "5/14/2016",
    "name": "Free Beckwourth 8hr MTB Race",
    "locationCity": "Beckwourth",
    "promoterUrl": "northlanderevents.com"
  }, {
    "date": "5/15/2016",
    "name": "Free Beckwourth 8hr MTB Race",
    "locationCity": "Beckwourth",
    "promoterUrl": "northlanderevents.com"
  }, {
    "date": "5/15/2016",
    "name": "Race Behind Bars #2",
    "locationCity": "Folsom",
    "promoterUrl": "http://www.racebehindbars.com/"
  }, {
    "date": "5/21/2016",
    "name": "Santa Cruz Old Cabin Classic",
    "locationCity": "Santa Cruz",
    "promoterUrl": "https://www.facebook.com/oldcabinclassic/"
  }, {
    "date": "5/21/2016",
    "name": "Pine Nut Cracker",
    "locationCity": "Gardnerville",
    "promoterUrl": "https://www.facebook.com/SierraCupMTB"
  }, {
    "date": "5/22/2016",
    "name": "CCCX#8",
    "locationCity": "Toro Park",
    "promoterUrl": "www.cccxcycling.com"
  }, {
    "date": "5/22/2016",
    "name": "6 \u0026 12 Hours of Weaverville",
    "locationCity": "Weaverville",
    "promoterUrl": "http://teambigfoot.net/"
  }, {
    "date": "5/22/2016",
    "name": "Nevada City Dirt Classic #3",
    "locationCity": "Nevada City",
    "promoterUrl": "http://ybonc.org/events/dirt-classic/"
  }, {
    "date": "5/28/2016",
    "name": "Ridin' High at the Ranch",
    "locationCity": "Susanville",
    "promoterUrl": "http://www.sabadirtriders.com/ridin--high.html"
  }, {
    "date": "5/29/2016",
    "name": "Race Behind Bars #3",
    "locationCity": "Folsom",
    "promoterUrl": "http://www.racebehindbars.com/"
  }, {
    "date": "6/3/2016",
    "name": "Boggs Funduro (Willits, CA)",
    "locationCity": "Willits",
    "promoterUrl": "www.bikemonkey.net"
  }, {
    "date": "6/4/2016",
    "name": "Boggs Funduro (Willits, CA)",
    "locationCity": "Willits",
    "promoterUrl": "www.bikemonkey.net"
  }, {
    "date": "6/5/2016",
    "name": "Boggs Funduro (Willits, CA)",
    "locationCity": "Willits",
    "promoterUrl": "www.bikemonkey.net"
  }, {
    "date": "6/3/2016",
    "name": "Coolest 8 and 24hr",
    "locationCity": "Beckwourth",
    "promoterUrl": "northlanderevents.com"
  }, {
    "date": "6/4/2016",
    "name": "Coolest 8 and 24hr",
    "locationCity": "Beckwourth",
    "promoterUrl": "northlanderevents.com"
  }, {
    "date": "6/5/2016",
    "name": "Coolest 8 and 24hr",
    "locationCity": "Beckwourth",
    "promoterUrl": "northlanderevents.com"
  }, {
    "date": "6/11/2016",
    "name": "Tamarancho Classic",
    "locationCity": "Tamarancho",
    "promoterUrl": "www.bikemonkey.net"
  }, {
    "date": "6/12/2016",
    "name": "Tamarancho Classic",
    "locationCity": "Tamarancho",
    "promoterUrl": "www.bikemonkey.net"
  }, {
    "date": "6/18/2016",
    "name": "Lake Tahoe MTB Race (XC, 4hr, 8hr)",
    "locationCity": "Tahoe City",
    "promoterUrl": "http://www.adventuresportsweektahoe.com"
  }, {
    "date": "6/19/2016",
    "name": "CCCX#9",
    "locationCity": "Fort Ord",
    "promoterUrl": "www.cccxcycling.com"
  }, {
    "date": "6/26/2016",
    "name": "Sagebrush Scramble",
    "locationCity": "Reno",
    "promoterUrl": "https://www.facebook.com/SierraCupMTB"
  }, {
    "date": "6/26/2016",
    "name": "Skyline Park MTB Race",
    "locationCity": "Napa",
    "promoterUrl": "http://www.eaglecyclingclub.org/mtbike.html"
  }, {
    "date": "6/26/2016",
    "name": "Mendocino 100",
    "locationCity": "Mendocino",
    "promoterUrl": "http://superproracing.com"
  }, {
    "date": "7/12/2016",
    "name": "USA Cycling XC Nat'l Champs",
    "locationCity": "Mammoth",
    "promoterUrl": "https://www.usacycling.org/events/national.php"
  }, {
    "date": "7/13/2016",
    "name": "USA Cycling XC Nat'l Champs",
    "locationCity": "Mammoth",
    "promoterUrl": "https://www.usacycling.org/events/national.php"
  }, {
    "date": "7/14/2016",
    "name": "USA Cycling XC Nat'l Champs",
    "locationCity": "Mammoth",
    "promoterUrl": "https://www.usacycling.org/events/national.php"
  }, {
    "date": "7/15/2016",
    "name": "USA Cycling XC Nat'l Champs",
    "locationCity": "Mammoth",
    "promoterUrl": "https://www.usacycling.org/events/national.php"
  }, {
    "date": "7/16/2016",
    "name": "USA Cycling XC Nat'l Champs",
    "locationCity": "Mammoth",
    "promoterUrl": "https://www.usacycling.org/events/national.php"
  }, {
    "date": "7/17/2016",
    "name": "USA Cycling XC Nat'l Champs",
    "locationCity": "Mammoth",
    "promoterUrl": "https://www.usacycling.org/events/national.php"
  }, {
    "date": "7/16/2016",
    "name": "Tahoe Trail MTB 50k \u0026 100k",
    "locationCity": "Northstar at Tahoe",
    "promoterUrl": "http://www.tahoetrailmtb.com/"
  }, {
    "date": "7/23/2016",
    "name": "CCCX#10",
    "locationCity": "Toro Park",
    "promoterUrl": "www.cccxcycling.com"
  }, {
    "date": "7/24/2016",
    "name": "Kirkwood Mountain Classic",
    "locationCity": "Kirkwood",
    "promoterUrl": "https://www.facebook.com/SierraCupMTB"
  }, {
    "date": "8/4/2016",
    "name": "Downieville Classic",
    "locationCity": "Downieville",
    "promoterUrl": "www.downievilleclassic.com"
  }, {
    "date": "8/5/2016",
    "name": "Downieville Classic",
    "locationCity": "Downieville",
    "promoterUrl": "www.downievilleclassic.com"
  }, {
    "date": "8/6/2016",
    "name": "Downieville Classic",
    "locationCity": "Downieville",
    "promoterUrl": "www.downievilleclassic.com"
  }, {
    "date": "8/7/2016",
    "name": "Downieville Classic",
    "locationCity": "Downieville",
    "promoterUrl": "www.downievilleclassic.com"
  }, {
    "date": "8/13/2016",
    "name": "Annadel XC",
    "locationCity": "Santa Rosa",
    "promoterUrl": "www.bikemonkey.net"
  }, {
    "date": "8/20/2016",
    "name": "Beckwourth 100 MTB Endurance (TS100)",
    "locationCity": "Beckwourth",
    "promoterUrl": "northlanderevents.com"
  }, {
    "date": "8/21/2016",
    "name": "Bodie Bowl",
    "locationCity": "Bodie",
    "promoterUrl": "http://www.bodiebowl.com/"
  }, {
    "date": "8/21/2016",
    "name": "CCCX Final",
    "locationCity": "Fort Ord",
    "promoterUrl": "www.cccxcycling.com"
  }, {
    "date": "9/11/2016",
    "name": "Great Tahoe Flume Race",
    "locationCity": "Spooner Lake",
    "promoterUrl": "https://www.facebook.com/SierraCupMTB"
  }, {
    "date": "9/25/2016",
    "name": "Gold Rush MTB",
    "locationCity": "Folsom",
    "promoterUrl": "totalbodyfitness.com"
  }, {
    "date": "9/25/2016",
    "name": "4 \u0026 8 Hours of Weaverville",
    "locationCity": "Weaverville",
    "promoterUrl": "http://teambigfoot.net/"
  }, {
    "date": "9/25/2016",
    "name": "World Solo 24hr MTB Champs.",
    "locationCity": "Weaverville",
    "promoterUrl": "http://www.teambigfoot.net/Wembo15.htm"
  }, {
    "date": "9/25/2016",
    "name": "Lagrange Fall Classic",
    "locationCity": "Weaverville",
    "promoterUrl": "http://teambigfoot.net/"
  }, {
    "date": "10/16/2016",
    "name": "TBF 50 Miler",
    "locationCity": "Folsom",
    "promoterUrl": "totalbodyfitness.com"
    }
]

export default {
  eventData
};
