import React from 'react'
import { render } from 'react-dom'
import { App } from './App'
import Grid from './styles/grid'

import { Router, Route, Link } from 'react-router'

let renderApp = function() {
  let browserWidth = window.document.body.offsetWidth
  let containerWidth = Grid.getContainerWidth(browserWidth)

  render(<App containerWidth={containerWidth} />, document.getElementById('root'))
}

//re-render app on windows resize
window.addEventListener('resize', () => renderApp())

//first time render
renderApp()
