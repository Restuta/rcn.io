const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
//const HtmlWebpackPlugin = require('html-webpack-plugin')
const consts = require('./webpack/constants')
// const nodeModules = require('./webpack/utils').nodeModules
const nodeExternals = require('webpack-node-externals')

const getConfig = require('./webpack/common-config').getConfig
const commonConfig = getConfig('prod')

module.exports = {
  devtool: 'source-map',
  // devtool: 'cheap-module-source-map',
  // devtool: 'cheap-module-source-map',
  target: 'node',
  cache: false,
  debug: false,

  externals: [nodeExternals()],

  entry: { app: path.join(consts.SRC_DIR, 'client/routes.js')},
  output: {
    path: path.join(__dirname, 'dist-server'),
    filename: '[name].server.bundle.js',
    libraryTarget: 'commonjs2',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      },
      '__ENV' : {
        'Prod': true,
        'Dev': false
      }
    }),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true, // eslint-disable-line camelcase
        warnings: false
      },
      mangle: {
        screw_ie8: true // eslint-disable-line camelcase
      },
      output: {
        comments: false,
        screw_ie8: true // eslint-disable-line camelcase
      }
    }),
    //used to ignore certain modules that we don't need on the server, so we don't waste time building them
    new webpack.NormalModuleReplacementPlugin(/\.(css|scss)$/, 'node-noop')
  ],
  resolve: {
    root: [
      //path.resolve(__dirname, 'src/'),
      path.resolve(__dirname, 'src/client'),
      path.resolve(__dirname, 'src/')
    ],
    alias: commonConfig.resolve.alias
  },
  module: {
    /* tells webpack to skip parsing following libraries
     requires use of "import loader" for certain modules, based on https://github.com/christianalfoni/react-webpack-cookbook/issues/30
    */
    noParse: commonConfig.module.noParse,
    loaders: commonConfig.module.loaders
  },
}
