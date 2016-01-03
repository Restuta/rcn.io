import React from 'react'
import { render } from 'react-dom'
import { App } from './App'

let browserWidth = window.document.body.offsetWidth

const onResize = () => {
  browserWidth = window.document.body.offsetWidth
}

window.addEventListener('resize', onResize)
console.info('index.js loaded')

render(<App browserWidth={browserWidth} />, document.getElementById('root'))
