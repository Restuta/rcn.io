import React from 'react'
import { Router, Route, Redirect, browserHistory, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import App from 'App'
import Home from 'Home'
import Dev from 'Dev'
import Cal from 'calendar/Cal'
import Mtb from 'calendar/Mtb'
import EventDetails from 'calendar/events/event-details/EventDetails.jsx'
import configureStore from 'shared/configure-store.js'
import { syncHistoryWithStore } from 'react-router-redux'

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)
history.listen(location => analytics.page())

//overriding Router function to pass custom props to a child components, building a higer order function to
//provide containerWidth to inner-clojure
const buildCreateElement = containerW =>
  (Component, props) => <Component {...props} containerWidth={containerW}/>

export default (containerWidth) => {
  return (
    <Provider store={store}>
      <Router history={history} createElement={buildCreateElement(containerWidth)}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="/dev" component={Dev} />
          <Route path="/cal" component={Cal} />
          <Route path="/calendars/norcal-mtb" component={Mtb} />
          <Route path="/events/:eventId" component={EventDetails}/>
          <Redirect from="/mtb" to="/calendars/norcal-mtb" />
          <Route path="*" component={Home}/>
        </Route>
      </Router>
    </Provider>
  )
}
