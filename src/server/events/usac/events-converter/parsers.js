const moment = require('moment')
const { isArray, first } = require('lodash/fp')
const { normalizeSpaces } = require ('./utils')

// TODO: multi-day support, now takes only first date
const parseDate = rawDates => {
  const dateString = isArray(rawDates) ? first(rawDates) : rawDates
  const parsedDate = moment(dateString)

  if (!parsedDate.isValid()) {
    throw new Error(`Date is invalid "${dateString}"`)
  }

  return parsedDate.format('MMMM DD YYYY')
}

module.exports = {
  parseDate
}
