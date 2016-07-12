import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import App from 'App'
import Home from 'Home'
import Dev from 'Dev'
import Cal from 'calendar/Cal'
import Mtb from 'calendar/Mtb'
import EventDetails from 'calendar/events/event-details/EventDetails.jsx'


const routes  = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/dev" component={Dev} />
    <Route path="/cal" component={Cal} />
    <Route path="/calendars/norcal-mtb" component={Mtb} />
    <Route path="/events/:eventId" component={EventDetails}/>
    <Redirect from="/mtb" to="/calendars/norcal-mtb" />
    <Route path="*" component={Home}/>
  </Route>
)

export default routes
