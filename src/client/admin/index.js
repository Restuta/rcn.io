import 'styles/bootstrap.scss'
import 'app.scss'

//to use generators
import 'regenerator-runtime/runtime'
// import 'core-js/library/es6/promise' //required for IE11
import 'isomorphic-fetch' //required for IE11 and Safary

import 'utils/polyfills'
import { render } from 'react-dom'
import Grid from 'client/styles/grid.js'
import { getConfiguredWithStoreRouter } from './get-router.js'


let prevContainerWidth

let renderApp = function() {
  const browserWidth = window.document.body.offsetWidth
  const containerWidth = Grid.getFluidContainerWidth(browserWidth)

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
