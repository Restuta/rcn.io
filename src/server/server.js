import path from 'path'
import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import fs from 'fs'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import getRoutes from '../../dist-server/app.bundle'
import {ContainerWidth} from '../client/styles/grid'

const RootDir = path.join(__dirname, '../..')
const EnvIsProd = process.env.NODE_ENV === 'production'
const Config = {
  morganLogType: EnvIsProd ? 'combined' : 'dev',
  port: EnvIsProd ? process.env.PORT : 3888,
}

const app = express()
app.disable('x-powered-by') //hides that we use express
app.use(compression()) // should be first middleware
app.use(morgan(Config.morganLogType))
app.use(express.static(path.join(RootDir, '/dist')))

const createElement = (Component, props) => <Component {...props} containerWidth={ContainerWidth.XL}/>
const Wrapper = (props) => <RouterContext {...props}  createElement={createElement}/>

app.get('/*', function(req, res, next) {
  const indexHtml = path.join(RootDir, '/dist/index1.html')
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
      renderProps.containerWidth = ContainerWidth.XL

      const content = renderToString(<Wrapper {...renderProps}/>)
      const fullHtml = indexHtmlContent.replace('<div id="root"></div>',
        `<div id="root">${content}</div>`)
      // console.info(indexHtmlContent.replace('<div id="root"></div>',
      //   `<div id="root">${content}</div>`))
      //console.info(fullHtml)
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
