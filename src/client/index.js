import { render } from 'react-dom'
import Grid from './styles/grid'
import getRoutes from './getRoutes'

let prevContainerWidth

let renderApp = function() {
  const browserWidth = window ? window.document.body.offsetWidth : 960
  const containerWidth = Grid.getContainerWidth(browserWidth)

  if (containerWidth === prevContainerWidth) {
    return
  }

  prevContainerWidth = containerWidth
  render(getRoutes(containerWidth), document.getElementById('root'))
}

window.addEventListener('resize', () => renderApp())

//first time render
renderApp()
