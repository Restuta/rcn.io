import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import App from 'App'
import Home from 'Home'
import Dev from 'Dev'
import MtbCalendar from 'calendar/MtbCalendar'
import NcncaCalendar from 'calendar/NcncaCalendar'
import NcncaDraftCalendar from 'calendar/NcncaDraftCalendar'
import EventDetails from 'calendar/events/event-details/EventDetails.jsx'
import AdminIndex from 'admin/index'
import CreateEventId from 'admin/events/CreateEventId.jsx'
import UploadFlyer from 'admin/events/UploadFlyer.jsx'

const routes  = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/dev" component={Dev} />
    <Route path="/calendars/norcal-mtb" component={MtbCalendar} />
    <Route path="/calendars/ncnca-2017-draft" component={NcncaDraftCalendar} />
    <Route path="/calendars/:calendarId" component={NcncaCalendar} />
    <Route path="/events/:eventId" component={EventDetails}/>
    <Redirect from="/mtb" to="/calendars/norcal-mtb" />

    <Route path="admin" component={AdminIndex}>
      <Route path="events/create-id" component={CreateEventId} />
      <Route path="events/upload-flyer" component={UploadFlyer} />
    </Route>


    <Route path="*" component={Home}/>
  </Route>
)

export default routes
