import React from 'react'
import { Route } from 'react-router'
import WidgetRoot from './WidgetRoot'
import UpcomingEvents from 'widgets/events/UpcomingEvents.jsx'

//alternative way is to define route root as /widgets and remove root in get-routes.js
const routes  = (
  <Route path="/" component={WidgetRoot}>
    {/* <IndexRoute component={Index} /> */}
    <Route path="upcoming-events" component={UpcomingEvents}/>
    {/* <Route path="*" component={Home}/> */}
  </Route>
)

export default routes
