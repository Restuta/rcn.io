import React from 'react'
import { Route } from 'react-router'
import WidgetRoot from './WidgetRoot'


const Test = (props) => (<div>🦁 Ok, come here, bunny.</div>)

//alternative way is to define route root as /widgets and remove root in get-routes.js
const routes  = (
  <Route path="/" component={WidgetRoot}>
    {/* <IndexRoute component={Index} /> */}
    <Route path="bla" component={Test}/>
    {/* <Route path="*" component={Home}/> */}
  </Route>
)

export default routes
