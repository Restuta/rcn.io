import Joi from 'joi'
import { flow, values, map, flatten, uniq, partialRight } from 'lodash'
import { EventTypes, Disciplines, Statuses } from 'client/calendar/events/types'

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
  _shortId: Joi.string().regex(/[a-zA-Z0-9_$]+$/gm).trim().required(),
  name: Joi.string().min(10).trim().required(),
  // TODO: define custom validation
  date: Joi.string().trim().required(),
  type: Joi.any().valid(getAllEventTypes(EventTypes)),
  discipline: Joi.any().valid(values(Disciplines)),
  usacPermit: Joi.string().regex(/(19|20)\d\d-\d{1,5}/),
  location: Joi.object().keys({
    name: Joi.string().trim().min(5),
    streetAddress: Joi.string().trim().allow('').min(5),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().length(2).required(),
    zip: Joi.string().trim().min(5),
    lat: Joi.number(),
    'long': Joi.number(),
  }),
  resultsUrl: Joi.string().uri(),
  websiteUrl: Joi.string().uri(),
  registrationUrl: Joi.string().uri(),
  flyerUrl: Joi.string().uri(),
  flyer: Joi.object().keys({
    name: Joi.string().min(5).allow(''),
    url: Joi.string().uri().required(),
    mimeType: Joi.any().valid([
      'application/pdf',
      'image/jpeg',
    ])
  }),
  status: Joi.any().valid(values(Statuses)),
  cancelationReason: Joi.string().min(5).allow(''),
  // if event status is "Moved" containes event id of the event to which original event is moved to
  movedToEventId: Joi.string().min(5),
  group: Joi.any().valid(['1', '2', '3', '4', '5', '']),
  draftNotes: Joi.string().min(5),
  isDraft: Joi.boolean().required(),
  promoters: Joi.array().items(Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().min(5).required(),
    contactName: Joi.string().min(5),
    contactInfo: Joi.string().allow(''),
  })),
  // information from promoter or extended promoter information
  promoterInfo: Joi.string(),
  series: Joi.array().items(Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    // short name of the series that can be used in narrow UI contexts
    shortName: Joi.string(),
    url: Joi.string().uri()
  })),

})

export default schema
