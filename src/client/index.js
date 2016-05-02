import 'public/img/favicon.ico'
import 'utils/polyfills'
import {
  render,
  // unmountComponentAtNode
} from 'react-dom'
import Grid from './styles/grid'
import getRoutes from './getRoutes'

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
