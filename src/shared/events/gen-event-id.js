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

//so we don't end-up with crazy long URLs, 100 is pessimistic for really long event names
const MAX_SLUG_LENGTH = 100

const createEventIdPrefix = (eventYear, eventName, shortSegmentName) => (
  shortSegmentName
    ? `evt-${shortSegmentName}-${eventYear}-${slugify(eventName, MAX_SLUG_LENGTH)}`
    : `evt-${eventYear}-${slugify(eventName, MAX_SLUG_LENGTH)}`
)

const createShortEventId = () => shortid.generate()

const createPrettyEventId = (eventYear, eventName, shortSegmentName, id) => {
  return createEventIdPrefix(eventYear, eventName, shortSegmentName) + `-${id}`
}

//generates pretty id including random part
const generatePrettyEventId = function() {
  return createPrettyEventId(...arguments, createShortEventId())
}

export {
  generatePrettyEventId,
  createEventIdPrefix,
  createPrettyEventId,
  createShortEventId
}
