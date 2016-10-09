import React from 'react'
import { Route, IndexRoute} from 'react-router'
import Widget from './Widget'
// import Home from 'Home'
// import Dev from 'Dev'
// import MtbCalendar from 'calendar/MtbCalendar'
// import NcncaCalendar from 'calendar/NcncaCalendar'
// import NcncaDraftCalendar from 'calendar/NcncaDraftCalendar'
import EventDetails from 'calendar/events/event-details/EventDetails.jsx'


console.info('WIDGETS Routes!')

const routes  = (
  <Route path="/widgets" component={Widget}>
    {/* <IndexRoute component={Widget} /> */}
    <Route path="/bla" component={EventDetails}/>
    {/* <Route path="*" component={Home}/> */}
  </Route>
)

export default routes
