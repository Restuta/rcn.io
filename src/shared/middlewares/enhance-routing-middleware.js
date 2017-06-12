import { get, set } from 'lodash'


// enhances routing middleware, by adding modal return location to every action
// this is useful for routed modals which may need access to previous location during
// action dispatch since it will be stored in the browser session automatically and
// therefore preserved after full browser refres (react-router-redux) just dispatches last action
// stored in session
export default routerMiddleware => store => next => action => {
  // only deal with routing action
  if (action.type.startsWith('@@router/')) {
    const state = store.getState()

    // mutating action state, since react-router-redux behaves funny with cloned actions
    // push becomes unstable and creates two records in the history

    // let newAction = cloneDeep(action)

    // TODO: below is one of those unfortunate hacky workarounds that needs to be fixed with migration to
    // react-router 4

    // this mutates internal react-router-redux action used to call browser history api
    // that is in turn stores "state" in browser session, so after page reload proper state can
    // be restored. This is a hacky workaround and has to be re-placed with upgrade to react-router 4
    /*
      test cases include:
        * open routed modal and close it
        * open routed modal, refresh browser, close modal
        * open routed modal, navigate to another routed modal (moved event), close it
        * open routed modal, navigate to another routed modal (moved event), refresh browser
        * open calendar, show/hide past few times, open routed modal, close it, press back / forward
          * it should re-fresh calendar honoring show/hide past
    */
    if (action.type === '@@router/CALL_HISTORY_METHOD') {
      const currentModalReturnLocation = get(action, 'payload.args[0].state.modalReturnLocation')

      set(action, 'payload.args[0].state.modalReturnLocation',
        (currentModalReturnLocation || state.app.modal.returnLocation)
      )
    } else {
      const currentModalReturnLocation = get(action, 'payload.state.modalReturnLocation')

      set(action, 'payload.state.modalReturnLocation',
        (currentModalReturnLocation || state.app.modal.returnLocation)
      )
    }
    return routerMiddleware(store)(next)(action)
  }

  return routerMiddleware(store)(next)(action)
}
