import React from 'react'
import { Route } from 'react-router'
import AdminRoot from './AdminRoot.js'
import CreateEventId from 'admin/events/CreateEventId.jsx'
import UploadFlyer from 'admin/events/UploadFlyer.jsx'


//alternative way is to define route root as /widgets and remove root in get-routes.js
const routes  = (
  <Route path="/" component={AdminRoot}>
    <Route path="events/create-id" component={CreateEventId} />
    <Route path="events/upload-flyer" component={UploadFlyer} />
  </Route>
)

export default routes
