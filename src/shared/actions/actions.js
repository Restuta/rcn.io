// action types
export const SHOW_ALL_EVENTS = 'SHOW_ALL_EVENTS'
export const HIDE_ALL_EVENTS = 'HIDE_ALL_EVENTS'

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
export function showAllEvents() {
  return { type: SHOW_ALL_EVENTS }
}

export function hideAllEvents() {
  return { type: HIDE_ALL_EVENTS }
}
