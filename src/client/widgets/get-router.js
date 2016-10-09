import React from 'react'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from 'shared/configure-store.js'
import { syncHistoryWithStore } from 'react-router-redux'
import routes from './routes'

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)
history.listen(location => analytics.page())

//overriding Router function to pass custom props to a child components, building a higer order function to
//provide containerWidth to inner-clojure
const buildCreateElement = containerW =>
  (Component, props) => <Component {...props} containerWidth={containerW}/>


const getRouter = containerWidth => {
  return <Router history={history} routes={routes} createElement={buildCreateElement(containerWidth)} />
}

const getConfiguredWithStoreRouter = containerWidth => {
  return (
    <Provider store={store}>
      {getRouter(containerWidth)}
    </Provider>
  )
}

export {
  getRouter,
  getConfiguredWithStoreRouter
}
