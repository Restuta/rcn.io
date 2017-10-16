//if starts from 'cal-' we assume it's a valid id, otherwise it's a "name"
//so by convention we prefix it with "cal-"

/*
  - ids MUST be consistent and start from 'cal-'
  - we SHOULD support names like "NCNCA-2016" to show this in  the URL
  - we COULD map names to ids and just do lookup (maintain lookup table)
  - names MUST be unique
*/

const getCalendarId = slugFromRouteParams => (
  (slugFromRouteParams || '').startsWith('cal-')
    ? slugFromRouteParams
    : 'cal-' + slugFromRouteParams
  )

export default getCalendarId
