const path = require('path')
const express = require('express')
const compression = require('compression')
const morgan = require('morgan')
const app = express()
// const React = require('react')
// const Router = require('react-router')

const EnvIsProd = process.env.NODE_ENV === 'production'
const Config = {
  morganLogType: EnvIsProd ? 'combined' : 'dev',
  port: EnvIsProd ? 80 : 3888,
}

app.use(morgan(Config.morganLogType))
app.use(express.static(path.join(__dirname, '/dist')))

if (EnvIsProd) {
  app.use(compression())
}

app.get('/*', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/dist/index.html'))

 //  Router.run(routes, req.url, Handler => {
 //   let content = React.renderToString(<Handler />);
 //   res.render('index', { content: content });
 // });
})


const server = app.listen(Config.port, function() {
  const host = server.address().address === '::' ? 'localhost' : server.address().address
  const port = server.address().port

  console.log('RCN server is listening at http://%s:%s', host, port) //eslint-disable-line  no-console
})
