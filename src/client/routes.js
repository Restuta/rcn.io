import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import App from 'App'
import Home from 'Home'
import Dev from 'Dev'
import CalCalendar from 'calendar/CalCalendar'
import MtbCalendar from 'calendar/MtbCalendar'
import NcncaCalendar from 'calendar/NcncaCalendar'
import NcncaDraftCalendar from 'calendar/NcncaDraftCalendar'
import EventDetails from 'calendar/events/event-details/EventDetails.jsx'


const routes  = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/dev" component={Dev} />
    <Route path="/cal" component={CalCalendar} />
    <Route path="/calendars/norcal-mtb" component={MtbCalendar} />
    <Route path="/calendars/ncnca-2017-draft" component={NcncaDraftCalendar} />
    <Route path="/calendars/:calendarId" component={NcncaCalendar} />
    <Route path="/events/:eventId" component={EventDetails}/>
    <Redirect from="/mtb" to="/calendars/norcal-mtb" />
    <Route path="*" component={Home}/>
  </Route>
)

export default routes
