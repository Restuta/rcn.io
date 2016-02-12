const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config.dev')
const constants = require('./constants')

const app = express()
const compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}))

app.use(webpackHotMiddleware(compiler))

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/src/client/index.html'))
})

app.listen(constants.DEV_SERVER_PORT, 'localhost', function(err) {
  if (err) {
    /* eslint-disable  no-console */
    console.log(err)
    return
  }

  /* eslint-disable  no-console */
  console.info('Listening at http://localhost:' + constants.DEV_SERVER_PORT)
})
