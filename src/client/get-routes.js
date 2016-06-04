import React from 'react'
import { Router, Route, Redirect, browserHistory, IndexRoute } from 'react-router'
import App from './App'
import Home from './Home'
import Dev from './Dev'
import Cal from './calendar/Cal'
import Mtb from './calendar/Mtb'

export default (containerWidth) => {
  //overriding Router function to pass custom props to a child components, building a higer order function to
  //provide containerWidth to inner-clojure
  const buildCreateElement = containerW =>
    (Component, props) => <Component {...props} containerWidth={containerW}/>

  const onChange = (event) => {
    analytics.page()
  }

  return (
    <Router history={browserHistory} createElement={buildCreateElement(containerWidth)}>
      <Route path="/" component={App} onChange={onChange}>
        <IndexRoute component={Home} />
        <Route path="/dev" component={Dev} />
        <Route path="/cal" component={Cal} />
        <Route path="/calendars/norcal-mtb" component={Mtb} />
        <Redirect from="/mtb" to="/calendars/norcal-mtb" />
        <Route path="*" component={Home}/>
      </Route>
    </Router>
  )
}
