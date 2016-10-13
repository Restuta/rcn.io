import path from 'path'
import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import fs from 'fs'
import device from 'express-device'
import consts from '../../webpack/constants'
import ms from 'ms'
import mime from 'mime-types'
import chalk from 'chalk'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { createMemoryHistory, match, RouterContext } from 'react-router'

//getting compiled by webpack function, so we don't have to deal with JSX on the server and it's transpilation
//otherwise we would have to transpile entire client app and have webpack setup to do that
import routes from '../../dist-server/app.server.bundle'

import { ContainerWidth } from '../client/styles/grid'

import { Provider } from 'react-redux'
import configureStore from 'shared/configure-store.js'
import { syncHistoryWithStore } from 'react-router-redux'

const RootDir = path.join(__dirname, '../..')
const EnvIsProd = process.env.NODE_ENV === 'production'
const morganProdFormatString = ':remote-addr :remote-user :user-agent (content-length: :res[content-length])'
  + ' :status :method :url :res[content-length] - :response-time[0]ms'
const morganDevFormatString = ':status :method :url - :response-time[0]ms'
const Config = {
  morganLogType: EnvIsProd ? morganProdFormatString : morganDevFormatString,
  port: EnvIsProd ? process.env.PORT : 3888,
}

const app = express()
app.disable('x-powered-by') //hides that we use express
app.use(compression()) // should be first middleware
app.use(morgan(Config.morganLogType))
app.use(express.static(path.join(RootDir, '/dist'), {
  maxAge: '14 days',
  //overriding cache control per-resourse
  setHeaders: (res, path, stat) => {
    const mimeType = mime.lookup(path)
    const cssAndJsMaxAge = ms('14 days') / 1000 //max age should be in seconds

    if (mimeType === 'text/css') {
      res.setHeader('Cache-Control', `public, max-age=${cssAndJsMaxAge}`)
    } else if (mimeType === 'application/javascript') {
      if (path.endsWith('vendor.bundle.js')) {
        //vendor scripts can be "public" and cached by intermediate caches
        res.setHeader('Cache-Control', `public, max-age=${cssAndJsMaxAge}`)
      } else {
        //non-vendor scripts can contain sensitive information and should not be cached by intermediate caches
        res.setHeader('Cache-Control', `private, max-age=${cssAndJsMaxAge}`)
      }
    }
  }
}))

app.use(device.capture({parseUserAgent: true}))

//gets container width by device type, we don't know for sure, so we use best guess and return
//pessimistically smaller containers
//TODO: this can be paired with "auto" height, so height would be calculated based on content size in
//browser automatically
const getContainerWidth = (deviceType) => {
  const typeToWidthMap = {
    phone: ContainerWidth.XS,
    tablet: ContainerWidth.MD,
    desktop: ContainerWidth.XL,
    //other
    bot: ContainerWidth.LG,
    car: ContainerWidth.SM,
    tv: ContainerWidth.MD
  }

  //for undetected using most common resolution that would fit most devices
  return (typeToWidthMap[deviceType] || ContainerWidth.MD)
}


//TODO: reconsile this with get-routes.js
const Wrapper = (props) => {
  const buildCreateElement = (containerW) =>
    (Component, props) => <Component {...props} containerWidth={containerW}/>
  const { containerWidth, store } = props

  return (
    <Provider store={store}>
      <RouterContext {...props}  createElement={buildCreateElement(containerWidth)}/>
    </Provider>
  )
}

let cache = {}
const CACHE_DURATION = ms('10m')

setInterval(() => {
  if (Object.keys(cache).length > 0) {
    cache = {}
    console.log('cleared cache...') //eslint-disable-line
  }
}, CACHE_DURATION)

const widgetsIndexHtml = path.join(RootDir, '/dist/widgets/index.html')
const widgetsIndexHtmlContent = fs.readFileSync(widgetsIndexHtml, 'utf8')

app.get('/widgets/*', function(req, res, next) {
  res.setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
  res.send(widgetsIndexHtmlContent)
})

const indexHtml = path.join(RootDir, `/dist/${consts.INDEX_HTML}`)
const indexHtmlContent = fs.readFileSync(indexHtml, 'utf8')

app.get('*', function(req, res, next) {
  // const indexHtml = path.join(RootDir, `/dist/${consts.INDEX_HTML}`)
  // const indexHtmlContent = fs.readFileSync(indexHtml, 'utf8')

  const memoryHistory = createMemoryHistory(req.path)
  //TODO: setup data fetching https://github.com/StevenIseki/react-router-redux-example/blob/master/serverProd.js
    // it uses "fetchData" async actions in all wrapper components, not sure this is ideal approach for us
  const store = configureStore()
  const history = syncHistoryWithStore(memoryHistory, store)

  match({history, routes, location: req.url}, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      //TODO: clean this up, may not be neccessary
      // just look away, this is ugly & wrong https://github.com/callemall/material-ui/pull/2172
      global.navigator = {userAgent: req.headers['user-agent']}

      const containerWidth = getContainerWidth(req.device.type)
      let fullHtml
      const key = req.url + containerWidth

      //since rendering is very simple so far we can cache it entirely in-memory
      if (cache[key]) {
        fullHtml = cache[key]
      } else {
        const content = renderToString(<Wrapper {...renderProps} containerWidth={containerWidth} store={store}/>)
        fullHtml = indexHtmlContent.replace('<div id="root"></div>', `<div id="root">${content}</div>`)
        cache[key] = fullHtml
      }

      // const containerWidth = getContainerWidth(req.device.type)
      // const content = renderToString(<Wrapper {...renderProps} containerWidth={containerWidth}/>)
      // const fullHtml = indexHtmlContent.replace('<div id="root"></div>', `<div id="root">${content}</div>`)

      res.setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
      res.send(fullHtml)
    } else {
      res.status(404).send('Not found')
    }
  })
})


const server = app.listen(Config.port, function() {
  const host = server.address().address === '::' ? 'localhost' : server.address().address
  const port = server.address().port

  console.log('RCN server is listening at http://%s:%s', host, port) //eslint-disable-line  no-console
})
