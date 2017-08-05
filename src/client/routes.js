import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import App from 'App'
import Home from 'Home'
import MtbCalendar from 'calendar/MtbCalendar'
import NcncaCalendar from 'calendar/NcncaCalendar'
import NcncaDraftCalendar from 'calendar/NcncaDraftCalendar'
import EventDetails from 'calendar/events/event-details/EventDetails.jsx'

/* eslint-disable react/jsx-key */
const productionRoutes = [
  <IndexRoute component={Home} />,
  <Route path="/calendars/norcal-mtb" component={MtbCalendar} />,
  <Route path="/calendars/ncnca-2017-draft" component={NcncaDraftCalendar} />,
  <Route path="/calendars/:calendarId" component={NcncaCalendar} />,
  <Route path="/events/:eventId" component={EventDetails}/>,
  <Redirect from="/mtb" to="/calendars/norcal-mtb" />,
  <Route path="*" component={Home}/>,
]

const allRoutes = __ENV.Dev
  ? [<Route path="/dev" component={require('Dev').default} />]
    .concat(productionRoutes)
  : productionRoutes

/* eslint-enable react/jsx-key */

// similar to defining route separately  like <Route path="/" component={App}>
// but allows to dynamically create prod/dev routes more easely
const routes = React.createElement(Route, { path: '/', component: App}, ...allRoutes)


export default routes
