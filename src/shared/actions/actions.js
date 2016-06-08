import { createAction as createActionCreator } from 'redux-actions'


//wraps default Action Creator factory to not have identity function be used
// when no payload is provided https://github.com/acdlite/redux-actions/issues/90
const makeActionCreator = (type, payloadCreator, metaCreator) =>
  createActionCreator(type, payloadCreator || (() => {}), metaCreator)

/* actions should follow Flux Standard Action https://github.com/acdlite/flux-standard-action

An action MUST
  be a plain JavaScript object.
  have a type property.

An action MAY
  have a error property.
  have a payload property.
  have a meta property.

const fluxStandardAction = {
  type: 'SOME_ACTION',
  payload: {
    data: 'any data'
  },
  //if actions represents an error
  //An action whose error is true is analogous to a rejected Promise. By convention, the payload SHOULD be an error object.
  error: true/false,
  //The optional meta property MAY be any type of value. It is intended for any extra information that is not part of the payload.
  meta: {}
}
*/

//action creators
export const toggleBaseline = makeActionCreator('Dbg.TOGGLE_BASELINE')
export const toggle3x3Grid = makeActionCreator('Dbg.TOGGLE_3X3_GRID')
export const toggleContainerEdges = makeActionCreator('Dbg.TOGGLE_CONTAINER_EDGES')

export const toggleShowPastEvents = makeActionCreator(
  'Cal.TOGGLE_PAST_EVENTS', (calendarId) => ({calendarId})
)
