import moment from 'moment'
import {
  createPrettyEventId,
  createShortEventId
} from 'shared/events/gen-event-id'


//use this funciton to convert draft events to non draft ones, should be donce once per year when draft
//calendar is done and NCNCA is ready to release official one
const convertDraftEventsToRealOnes = transformedDraftEvents =>
  transformedDraftEvents.map(event => {
    const momentDate = moment(event.date, 'MMMM DD YYYY')
    const shortId = createShortEventId()
    const prettyId = createPrettyEventId(momentDate.year(), event.name, 'ncnca', shortId)

    return {
      ...event,
      id: prettyId,
      _shortId: shortId,
      isDraft: false
    }
  })

export default convertDraftEventsToRealOnes
