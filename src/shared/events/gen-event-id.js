/*
generate id manually by hitting
https://runkit.io/restuta/rcn-shortid/branches/master
*/

import slugify from 'shared/utils/slugify'
import shortid from 'shortid'
//custom alphabet, since by default it includes "-" which we are using as a separator as well
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$')

//genereates event ids

/* creates event id prefix that can be used to create readable event id
  that is url-safe in the format "evt-ncnca-2017-name"
  "shortSegmentName" is any short name to segment events further, usually it's a
  calendar short name or any other meaninful acronym
*/
const createEventIdPrefix = (eventDate, eventName, shortSegmentName) => (
  shortSegmentName
    ? `evt-${shortSegmentName}-${eventDate.year()}-${slugify(eventName)}`
    : `evt-${eventDate.year()}-${slugify(eventName)}`
)

const createShortEventId = () => shortid.generate()

const createPrettyEventId = (eventDate, eventName, shortSegmentName, id) => {
  return createEventIdPrefix(eventDate, eventName, shortSegmentName) + `-${id}`
}



export {
  createEventIdPrefix,
  createPrettyEventId,
  createShortEventId
}
