// action types
export const SHOW_ALL_EVENTS = 'SHOW_ALL_EVENTS'
export const HIDE_ALL_EVENTS = 'HIDE_ALL_EVENTS'

export const TOGGLE_BASELINE = 'TOGGLE_BASELINE'
export const TOGGLE_3X3_GRID = 'TOGGLE_3X3_GRID'
export const TOGGLE_CONTAINER_EDGES = 'TOGGLE_CONTAINER_EDGES'

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
export const showAllEvents = () => ({ type: SHOW_ALL_EVENTS })
export const hideAllEvents = () => ({ type: HIDE_ALL_EVENTS })
export const toggleBaseline = () => ({ type: TOGGLE_BASELINE })
export const toggle3x3Grid = () => ({ type: TOGGLE_3X3_GRID })
export const toggleContainerEdges = () => ({ type: TOGGLE_CONTAINER_EDGES })
