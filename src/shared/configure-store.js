import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from 'shared/reducers/reducer.js'
import createSagaMiddleware from 'redux-saga'
import rootSaga from 'shared/sagas/root'

const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]

//use logging middleware only in dev mode
if (process.env.NODE_ENV === 'development') {
  const createLogger =  require('redux-logger')
  const logger = createLogger({
    diff: true,
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
}


const configureStore = (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares), //logger must be last middleware,
      //server-side safe enabling of Redux Dev tools
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
