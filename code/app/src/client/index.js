import React from 'react'
import { render } from 'react-dom'
import App from './App'
import Dev from './Dev'
import Grid from './styles/grid'
import { Router, Route, browserHistory } from 'react-router'

let renderApp = function() {
  let browserWidth = window.document.body.offsetWidth
  let containerWidth = Grid.getContainerWidth(browserWidth)

  render((
    <Router history={browserHistory}>
      {/* passing conteiner width in a hacky way, for fast first-time browser render */}
      <Route path="/" containerWidth={containerWidth} foo="foo1" component={App}>
        <Route path="/dev" component={Dev} />
      </Route>
    </Router>
  ), document.getElementById('root'))

}

//first time render
renderApp()


// render((
//   <Router history={browserHistory}>
//     <Route path="/" foo="foo1" component={App}>
//       <Route path="/dev" component={Dev} />
//     </Route>
//   </Router>
// ), document.getElementById('root'))
