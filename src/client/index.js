//favicons
import 'public/img/favicon.ico'
import 'public/img/apple-touch-icon-152x152.png'
import 'public/img/apple-touch-icon-180x180.png'
import 'public/img/safari-pinned-tab.svg'


import 'utils/polyfills'
import {
  render,
  // unmountComponentAtNode
} from 'react-dom'
import Grid from 'client/styles/grid.js'
import getRoutes from 'client/get-routes.js'

let prevContainerWidth

let renderApp = function() {
  const browserWidth = window.document.body.offsetWidth
  const containerWidth = Grid.getContainerWidth(browserWidth)

  if (containerWidth === prevContainerWidth) {
    return
  }

  prevContainerWidth = containerWidth

  //unmountComponentAtNode(document.getElementById('root'))
  render(getRoutes(containerWidth), document.getElementById('root'))
}

window.addEventListener('resize', renderApp)


//first time render
renderApp()
