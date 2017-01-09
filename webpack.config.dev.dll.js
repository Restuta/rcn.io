const path = require('path')
const webpack = require('webpack')
const consts = require('./webpack/constants')

const outputPath = path.join(__dirname, 'dist')

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
    vendor: [
      'classnames',
      'exenv',
      'isomorphic-fetch',
      'moment',
      'moment-timezone',
      'react',
      'react-dom',
      'react-modal2',
      'react-pure-render',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
      'redux-actions',
      'redux-saga',
      'redux-logger',
      'regenerator-runtime',
      'reselect',
      'svg-inline-react',
    ],
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
    loaders: [{
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.(js|jsx?)$/,
      loader: 'babel',
      exclude: /(node_modules|bower_components)/,
      include: [
        path.join(consts.SRC_DIR)
      ],
      query: {
        presets: ['react', 'es2015', 'stage-2'],
        cacheDirectory: true, //not needed for prod build
        plugins: [
          ['react-transform', {
            'transforms': [{
              'transform': 'react-transform-hmr',
              'imports': ['react'],
              'locals': ['module']
            }, {
              'transform': 'react-transform-catch-errors',
              'imports': ['react', 'redbox-react']
            }]
          }]
        ]
      }
    }, {
      test: /\.scss$/,
      //loaders: ['style', ExtractTextPlugin.extract('css?localIdentName=[name]_[local]_[hash:base64:3]!sass')],
      //loaders: ['style', 'css?localIdentName=[name]_[local]_[hash:base64:3]', 'sass'],
      loader: 'style!css!postcss!sass',
      exclude: /(node_modules|bower_components)/,
      include: path.join(consts.SRC_DIR, 'client')
    }, {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      exclude: /(node_modules|bower_components)/,
      loaders: ['url?limit=10000&mimetype=application/font-woff'],
      include: path.join(consts.SRC_DIR, 'client')
    }, {
      test: /\.(jpg|jpeg|gif|png|ico|svg)$/,
      exclude: /(node_modules|bower_components)/,
      include: path.join(consts.SRC_DIR, 'client'),
      loader: 'file-loader?name=[path][name].[ext]&context=' + consts.IMG_DIR
    }]
  },
  //required to have proper rem to px calcualtion, default floating point precision is not enough
  //since most browsers use 15, SASS only uses 5, this leads to calculated size in px like 38.0001px
  sassLoader: {
    precision: 15,
    includePaths: [path.join(consts.SRC_DIR, 'client/styles')]
  },
}
