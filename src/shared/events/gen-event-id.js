import slugify from 'shared/utils/slugify'
import shortid from 'shared/utils/shortid'

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

const createShortEventId = () => shortid()

const createPrettyEventId = (eventDate, eventName, shortSegmentName, id) => {
  return createEventIdPrefix(eventDate, eventName, shortSegmentName) + `-${id}`
}



export {
  createEventIdPrefix,
  createPrettyEventId,
  createShortEventId
}
