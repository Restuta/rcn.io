const path = require('path');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const constants = require('./constants');

module.exports = {
  // cheap-module-eval-source-map, because we want original source, but we don't
  // care about columns, which makes this devtool faster than eval-source-map.
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: 'cheap-module-eval-source-map',
  // devtool: 'eval',
  cache: true,
  debug: true,

  entry: [
    'webpack-hot-middleware/client?path=http://localhost:' + constants.DEV_SERVER_PORT + '/__webpack_hmr',
    path.join(constants.SRC_DIR, 'client/index.js')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    //new WebpackNotifierPlugin({title: 'webpack:rcn'}),
  ],
  module: {
    loaders: [{
      test: /\.js|.jsx$/,
      loaders: ['babel'],
      exclude: /node_modules/,
      include: path.join(__dirname, 'src/client')
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass'],
      exclude: /node_modules/,
      include: path.join(__dirname, 'src/client')
    }]
  }
};
