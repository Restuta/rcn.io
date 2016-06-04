import { createStore } from 'redux'
import rootReducer from 'shared/reducers/reducer.js'

const configureStore = (initialState) => {
  const store = createStore(rootReducer, initialState)

  //according to https://github.com/reactjs/react-redux/releases/tag/v2.0.0
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('shared/reducers/reducer.js', () => {
      const nextRootReducer = require('shared/reducers/reducer.js')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configureStore
