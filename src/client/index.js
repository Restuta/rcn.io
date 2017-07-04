import 'styles/bootstrap.scss'
import 'app.scss'

//to use generators
import 'regenerator-runtime/runtime'
// import 'core-js/library/es6/promise' //required for IE11
import 'isomorphic-fetch' //required for IE11 and Safary

//favicons
import 'public/img/favicon.ico'
import 'public/img/apple-touch-icon-152x152.png'
import 'public/img/apple-touch-icon-180x180.png'
import 'public/img/safari-pinned-tab.svg'

// // import React from 'react'
// if (process.env.NODE_ENV !== 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update')
//   whyDidYouUpdate(require('react'), { exclude: /.+Connect|Col|Week|Row|Day/})
//   // whyDidYouUpdate(React, { exclude: /.+Calendar|Connect|TopNavbar|/ })
//   // whyDidYouUpdate(React, { exclude: /.+Connect|TopNavbar|Week|Row|Col|/ })
// }

import 'utils/polyfills'
import { render } from 'react-dom'
import Grid from 'client/styles/grid.js'
import { getConfiguredWithStoreRouter } from './get-router.js'

let prevContainerWidth

let renderApp = function() {
  const browserWidth = window.document.body.offsetWidth
  const containerWidth = Grid.getContainerWidth(browserWidth)

  if (containerWidth === prevContainerWidth) {
    return
  }

  prevContainerWidth = containerWidth

  render(getConfiguredWithStoreRouter(containerWidth), document.getElementById('root'))
}

window.addEventListener('resize', renderApp)

//first time render
renderApp()


// sending redux acdtion when browser size changes
import { setBrowserWidth } from 'shared/actions/actions'
import { getStore } from './get-router.js'
import { debounce } from 'lodash'

const store = getStore()

window.addEventListener('resize', debounce(() => store.dispatch(
  setBrowserWidth(window.document.body.offsetWidth)
), 200))
