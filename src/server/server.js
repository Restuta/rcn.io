import path from 'path'
import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import fs from 'fs'
import device from 'express-device'
import consts from '../../webpack/constants'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import getRoutes from '../../dist-server/app.server.bundle'
import {ContainerWidth} from '../client/styles/grid'

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
app.use(express.static(path.join(RootDir, '/dist')))
app.use(device.capture({parseUserAgent: true}))

const Wrapper = (props) => {
  const buildCreateElement = (containerW) =>
    (Component, props) => <Component {...props} containerWidth={containerW}/>
  const {containerWidth} = props

  return <RouterContext {...props}  createElement={buildCreateElement(containerWidth)}/>
}

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


let cache = {}
const oneHourInMs = 1000 * 60 * 3600

setInterval(() => {
  cache = {}
  console.log('cleared cache...') //eslint-disable-line
}, oneHourInMs)

app.get('/*', function(req, res, next) {
  const indexHtml = path.join(RootDir, `/dist/${consts.INDEX_HTML}`)
  //res.sendFile(indexHtml)

  const indexHtmlContent = fs.readFileSync(indexHtml, 'utf8')
  const routes = getRoutes(ContainerWidth.XL)

  match({routes, location: req.url}, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      // just look away, this is ugly & wrong https://github.com/callemall/material-ui/pull/2172
      GLOBAL.navigator = {userAgent: req.headers['user-agent']}

      const containerWidth = getContainerWidth(req.device.type)
      let fullHtml
      const key = req.url + containerWidth

      //since rendering is very simple so far we can cache it entirely in-memory
      if (cache[key]) {
        fullHtml = cache[key]
      } else {
        const content = renderToString(<Wrapper {...renderProps} containerWidth={containerWidth}/>)
        fullHtml = indexHtmlContent.replace('<div id="root"></div>', `<div id="root">${content}</div>`)
        cache[key] = fullHtml
      }

      // const containerWidth = getContainerWidth(req.device.type)
      // const content = renderToString(<Wrapper {...renderProps} containerWidth={containerWidth}/>)
      // const fullHtml = indexHtmlContent.replace('<div id="root"></div>', `<div id="root">${content}</div>`)

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
