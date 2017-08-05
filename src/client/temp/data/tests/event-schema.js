
const Joi = require('joi')
const { flow, values, map, flatten, uniq, partialRight } = require('lodash')
const { EventTypes, Disciplines, Statuses } = require('client/calendar/events/types')

const getAllEventTypes = eventTypesMap =>
  flow(
    values,
    partialRight(map, x => values(x)),
    flatten,
    uniq
  )(eventTypesMap)

const schema = Joi.object().keys({
  // TODO: define id regex
  id: Joi.string().trim().required(),
  _shortId: Joi.string().regex(/[a-zA-Z0-9_$]+$/gm).trim(),
  name: Joi.string().min(5).trim().required(),
  // TODO: define custom validation
  date: Joi.string().trim().required(),
  type: Joi.any().valid(getAllEventTypes(EventTypes)),
  discipline: Joi.any().valid(values(Disciplines)),
  usacPermit: Joi.string().regex(/(19|20)\d\d-\d{1,5}/).allow(''),
  location: Joi.object().keys({
    name: Joi.string().trim().min(5).allow(''),
    streetAddress: Joi.string().trim().allow('').min(5),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().length(2).required(),
    zip: Joi.string().trim().min(5).allow(''),
    lat: Joi.number().allow(''),
    'long': Joi.number().allow(''),
  }),
  usac: Joi.object().keys({
    status: Joi.string().required(),
    category: Joi.string().required(),
    type: Joi.any().valid([
      'Results & Ranking',
      'Fun',
      'State/Regional Championships'
    ]),
  }),
  resultsUrl: Joi.string().uri().allow(''),
  websiteUrl: Joi.string().uri().allow(''),
  registrationUrl: Joi.string().uri().allow(''),
  flyerUrl: Joi.string().uri().allow(''),
  flyer: Joi.object().keys({
    name: Joi.string().min(5).allow(''),
    url: Joi.string().uri().required().allow(''),
    mimeType: Joi.any().valid([
      'application/pdf',
      'image/jpeg',
    ]).allow('')
  }),
  status: Joi.any().valid(values(Statuses)).allow(''),
  cancelationReason: Joi.string().min(5).allow(''),
  // if event status is "Moved" containes event id of the event to which original event is moved to
  movedToEventId: Joi.string().min(5),
  // represents NCNCA event group that is used for planning
  group: Joi.any().valid(['1', '2', '3', '4', '5', '']),
  draftNotes: Joi.string().min(5),
  isDraft: Joi.boolean(),
  promoters: Joi.array().items(Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().min(5).required(),
    contactName: Joi.string().min(5),
    contactInfo: Joi.string().allow(''),
    // more info about the club here https://www.usacycling.org/clubs/clubsearch.php?club={clubId}
    usacClubId: Joi.number().allow(''),
  })),
  // information from promoter or extended promoter information
  promoterInfo: Joi.string().allow(''),
  series: Joi.array().items(Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    // short name of the series that can be used in narrow UI contexts
    shortName: Joi.string(),
    url: Joi.string().uri().allow('')
  })),

})

module.exports = schema
