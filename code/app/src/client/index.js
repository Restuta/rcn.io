import React from 'react'
import { render } from 'react-dom'
import { App } from './App'

// /console.info(window.document.body.offsetWidth);

render(<App browserWidth={window.document.body.offsetWidth} />, document.getElementById('root'))
