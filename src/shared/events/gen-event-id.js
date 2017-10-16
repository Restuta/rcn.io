/*
generate id manually by hitting
https://rcn.io/admin/create-event-id
*/

const slugify = require('shared/utils/slugify')
const shortid = require('shortid')
//custom alphabet, since by default it includes "-" which we are using as a separator as well
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$')

//so we don't end-up with crazy long URLs, 100 is pessimistic for really long event names
const MAX_SLUG_LENGTH = 100

/**
 * Creates just a prefix of the event id without unique id part
 * @param {[type]} eventYear Yeah this even is taking place at
 * @param {[type]} eventName Name of the event
 * @param {[type]} shortSegmentName Typically used to improve event identificaiton
 * by just looking at it id, for example for NCNCA it would be "ncnca"
 * @returns {[type]} String
 */
const createEventIdPrefix = (eventYear, eventName, shortSegmentName) => (
  shortSegmentName
    ? `evt-${shortSegmentName}-${eventYear}-${slugify(eventName, MAX_SLUG_LENGTH)}`
    : `evt-${eventYear}-${slugify(eventName, MAX_SLUG_LENGTH)}`
)

/**
 * Creates shour id that is URL-friendly and unique. Can be used for indexing.
 * It's not uniformly random, but is not sequential. Length varies based on volume of ids
 * generated at the given unit of time.
 * @returns {[string]}
 */
const createShortEventId = () => shortid.generate()

/**
 * Creates pretty and human-readable event id, suitable for use in URL
 * @param {[number]} eventYear Yeah this even is taking place at
 * @param {[string]} eventName Name of the event
 * @param {[string]} shortSegmentName Typically used to improve event identificaiton
 * by just looking at it id, for example for NCNCA it would be "ncnca". Typically it's
 * a calendar short name.
 * @param   {[string]} id Short, app-wide-unique id of the event. Will be used for
 * indexing.
 * @returns {[string]}
 */
const createPrettyEventId = (eventYear, eventName, shortSegmentName, id) => {
  return createEventIdPrefix(eventYear, eventName, shortSegmentName) + `-${id}`
}

/**
 * Generates pretty event id, returning different random part every time.
 * @returns {[string]}
 */
const generatePrettyEventId = function() {
  return createPrettyEventId(...arguments, createShortEventId())
}

module.exports = {
  // generates new pretty id including random part
  generatePrettyEventId,
  createEventIdPrefix,
  createPrettyEventId,
  createShortEventId
}
