import { partial, get, last, isString, isBoolean } from 'lodash'
import moment from 'moment'

const formatDate = value =>
  value.isValid()
    ? value.format('MMMM DD YYYY')
    : ''

const formatValue = value => {
  const dateFormat = 'MMMM DD YYYY'

  if (isString(value)) {
    const date = moment(value, dateFormat)
    const stringOrDate = date.isValid() ? formatDate(date) : value
    return `"${stringOrDate}"`
  } else if (isBoolean(value)) {
    return value
  } else if (moment.isMoment(value)) {
    return `"${formatDate(value)}"`
  }

  if (!value) {
    return undefined
  }

  const objAsStr = value ? value.toString('') : ''
  return `"${objAsStr}"`
}

const getValue = (obj, path) => {
  const value = get(obj, path)
  if (path === 'value') {
    console.info(`${path}: ${value}`)
    console.info(obj)
  }
  return formatValue(value)
}

const createTemplatePart = (name, value = '', defaultValue = '', commentedIfNoValue = true) => {
  return (value
    ? `"${name}": ${value},`
    : (commentedIfNoValue
      ?  `// "${name}": ${formatValue(defaultValue)},`
      :  `"${name}": ${formatValue(defaultValue)},`
    )
  )
}

const createTemplatePartForEventProp = (event, commentedIfNoValue, propName, defaultValue) => {
  const propIsNested = propName.includes('.')
  const shortName = propIsNested
    ? last(propName.split('.'))
    : propName

  return createTemplatePart(shortName, getValue(event, propName), defaultValue, commentedIfNoValue)
}

export default ({ id, name, shortId, event }) => {

  const createOptionalPart = partial(createTemplatePartForEventProp, event, /* commentedIfNoValue */ true)
  const createRequiredPart = partial(createTemplatePartForEventProp, event, /* commentedIfNoValue */ false)

  const template = `{
    "id": "${id}",
    "name": "${name}",
    ${createOptionalPart('status')}
    ${createOptionalPart('cancelationReason', 'plain text reason given by promoter')}
    ${createOptionalPart('movedToEventId', 'id of event it is moved to or leave empty')}
    ${createRequiredPart('type')}
    ${createRequiredPart('discipline', 'Road')}
    ${createRequiredPart('date', 'January 01 2017')}
    ${createOptionalPart('usacPermit', '2017-XXX')}
    "location": {
      ${createOptionalPart('location.name')}
      ${createRequiredPart('location.streetAddress')}
      ${createRequiredPart('location.city')}
      ${createRequiredPart('location.state')}
      ${createOptionalPart('location.zip')}
      ${createOptionalPart('location.lat')}
      ${createOptionalPart('location.long')}
      ${createRequiredPart('location.exactStartLocation')}
    },
    ${createOptionalPart('websiteUrl')}
    ${createOptionalPart('resultsUrl')}
    "promoters": [{
      ${createOptionalPart('promoters.0.id')}
      ${createOptionalPart('promoters.0.name')}
      ${createOptionalPart('promoters.0.contactName')}
      ${createOptionalPart('promoters.0.contactInfo')}
    }],
    ${createOptionalPart('registrationUrl')},
    "flyer": {
      ${createOptionalPart('flyer.url', 'not used if permit number is set')},
      "mimeType": "application/pdf"
    },
    /* "flyer": {
       "url": "",
       "mimeType": "application/pdf"
     }, */
    /*
    "series": [{
       "id": "",
       "name": "",
       "url": ""
     }],
     */
    "isDraft" : false,
    "_shortId" : "${shortId}"
  }`

  return template
}
