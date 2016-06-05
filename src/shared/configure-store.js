import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from 'shared/reducers/reducer.js'

const middlewares = []

//use logging middleware only in dev mode
if (__ENV.Dev) {
  const createLogger =  require('redux-logger')
  const logger = createLogger({
    diff: true,
    timestamp: false,
    duration: true,
    collapsed: false,
    colors: {
      title: (action) => '#EEE',
      prevState: (state) => '#9e9e9e',
      action: (action) => 'yellowgreen',
      nextState: (state) => '#98AFC7'
    }
  })

  middlewares.push(logger)
}


const configureStore = (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares), //logger must be lasst middleware,
      //server-side safe enabling of Redux Dev tools
      typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
    )

  )

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
