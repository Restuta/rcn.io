const path = require('path')
const express = require('express')
const app = express()

// const React = require('react')
// const Router = require('react-router')

app.use(express.static(path.join(__dirname, '/dist')))

app.get('/*', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/dist/index.html'))

 //  Router.run(routes, req.url, Handler => {
 //   let content = React.renderToString(<Handler />);
 //   res.render('index', { content: content });
 // });
})


const server = app.listen(3888, function() {
  const host = server.address().address === '::' ? 'localhost' : server.address().address
  const port = server.address().port

  console.log('RCN server is listening at http://%s:%s', host, port) //eslint-disable-line  no-console
})
