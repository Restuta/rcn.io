import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './App'
import Home from './Home'
import Dev from './Dev'
import Cal from './calendar/Index'
import Mtb from './calendar/Mtb'

export default (containerWidth) => {
  //overriding Router function to pass custom props to a child components, building a higer order function to
  //provide containerWidth to inner-clojure
  console.info(containerWidth)
  const createElement = containerWidth =>
    (Component, props) => <Component {...props} containerWidth={containerWidth}/>

  return (
    <Router history={browserHistory} createElement={createElement(containerWidth)}>
      {/* passing conteiner width in a hacky way, for fast first-time browser render */}
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="/dev" component={Dev} />
        <Route path="/cal" component={Cal} />
        <Route path="/mtb" component={Mtb} />
        <Route path="*" component={Home}/>
      </Route>
    </Router>
  )
}

//export default getRoutes
