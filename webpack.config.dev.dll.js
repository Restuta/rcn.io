const path = require('path')
const webpack = require('webpack')
const consts = require('./webpack/constants')

const getConfig = require('./webpack/common-config').getConfig
const commonConfig = getConfig('dev')

const outputPath = path.join(__dirname, 'dist')

const pkg = require(path.resolve(process.cwd(), 'package.json'))
const vendorDependencyNames = Object.keys(pkg.dependencies)

module.exports = {
  // cheap-module-eval-source-map, because we want original source, but we don't
  // care about columns, which makes this devtool faster than eval-source-map.
  // http://webpack.github.io/docs/configuration.html#devtool

  devtool: 'eval',
  target: 'web', // Make web variables accessible to webpack, e.g. window
  // devtool: 'cheap-module-eval-source-map',

  cache: true,
  debug: true,

  entry: {
    //adding other deps for dev build to vendor chunk to speed up build
    vendor: vendorDependencyNames
      .concat([
        path.join(consts.SRC_DIR, 'client/styles/bootstrap.scss'),
      ]),
  },
  output: {
    filename: '[name].dll.js',
    path: outputPath,
    library: '[name]',
    publicPath: '/dist'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      },
      '__ENV' : {
        'Prod': false,
        'Dev': true
      }
    }),
    new webpack.DllPlugin({
      name: '[name]',
      path: path.join(outputPath, '[name]-manifest.json'),
      context: path.join(consts.SRC_DIR, 'client')
    })
  ],
  resolve: {
    root: [
      path.resolve(__dirname, 'src/client'),
      path.resolve(__dirname, 'src/')
    ],
  },
  module: {
    /* tells webpack to skip parsing following libraries
     requires use of "import loader" for certain modules, based on https://github.com/christianalfoni/react-webpack-cookbook/issues/30
    */
    loaders: commonConfig.module.loaders
  },
  //required to have proper rem to px calcualtion, default floating point precision is not enough
  //since most browsers use 15, SASS only uses 5, this leads to calculated size in px like 38.0001px
  sassLoader: {
    precision: 15,
    includePaths: [path.join(consts.SRC_DIR, 'client/styles')]
  },
}
