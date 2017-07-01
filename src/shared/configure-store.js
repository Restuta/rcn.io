import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from 'shared/reducers/reducer.js'
import createSagaMiddleware from 'redux-saga'
import rootSaga from 'shared/sagas/root'

import { browserHistory } from 'react-router'
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux'

const routingMiddlewhare = createRouterMiddleware(browserHistory)

const sagaMiddleware = createSagaMiddleware()
const middlewares = [
  sagaMiddleware,
  // used to process routing actions like push() and replace() (navigaiton with redux actions)
  // it's not required for routing to work with redux if actions are not used
  routingMiddlewhare
]

// use logging middleware only in dev mode
if (process.env.NODE_ENV === 'development') {
  const createLogger =  require('redux-logger')
  const logger = createLogger({
    diff: false, //diff it adds like 1s overhead for 300-400 events
    timestamp: false,
    duration: true,
    collapsed: true,
    colors: {
      title: (action) => '#EEE',
      prevState: (state) => '#9e9e9e',
      action: (action) => 'yellowgreen',
      nextState: (state) => '#98AFC7'
    }
  })

  middlewares.push(logger)

  // const reactPerfMiddleware = require('shared/middlewares/react-perf-middleware').default
  // middlewares.push(reactPerfMiddleware)
}


const configureStore = (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares), //logger must be last middleware,
      // server-side safe enabling of Redux Dev tools
      typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
    )

  )

  sagaMiddleware.run(rootSaga)

  //according to https://github.com/reactjs/react-redux/releases/tag/v2.0.0
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('shared/reducers/reducer.js', () => {
      const nextRootReducer = require('shared/reducers/reducer.js').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configureStore
