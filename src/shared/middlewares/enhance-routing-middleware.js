// enhances routing middleware, by adding modal return location to every action
// this is useful for routed modals which may need access to previous location during
// action dispatch since it will be stored in the browser session automatically

export default routerMiddleware => store => next => action => {
  if (action.payload && action.payload.state) {
    const state = store.getState()
    const newAction = {
      ...action,
      payload: {
        ...action.payload,
        state: {
          ...action.payload.state,
          modalReturnLocation:
            // if return location is not provided by action, pull it from the store
            (action.payload.state.modalReturnLocation || state.app.modal.returnLocation)
        }
      }
    }
    return routerMiddleware(store)(next)(newAction)
  }

  return routerMiddleware(store)(next)(action)
}
