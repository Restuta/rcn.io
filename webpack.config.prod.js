const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const consts = require('./webpack/constants')
const nodeModules = require('./webpack/utils').nodeModules

const getConfig = require('./webpack/common-config').getConfig
const commonConfig = getConfig('prod')


const pathToReactDOM = nodeModules('react-dom/dist/react-dom.min.js')
const pathToReactRouter = nodeModules('react-router/umd/ReactRouter.min.js')
const pathToMomentTimezone = nodeModules('moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js')

module.exports = {
  //devtool: 'source-map',
  devtool: 'cheap-module-source-map',

  cache: false,
  debug: false,

  entry: {
    app: [
      path.join(consts.SRC_DIR, 'client/index.js')
    ],
    widgets: [
      path.join(consts.SRC_DIR, 'client/widgets/index.js')
    ],
    vendor: commonConfig.entry.vendor.concat([
      // path.join(consts.SRC_DIR, 'client/temp/data/2016-mtb'),
      // path.join(consts.SRC_DIR, 'client/temp/data/2016-mtb-manual'),
      // path.join(consts.SRC_DIR, 'client/temp/data/2016-ncnca-events'),
    ])
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
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
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity
    }),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('app.css'),
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
    new HtmlWebpackPlugin({
      filename: consts.INDEX_HTML,
      title: 'RCN.io',
      // chunks: ['app', 'vendor'],
      template: path.resolve(consts.SRC_DIR, 'client/index.html.ejs'), // Load a custom template
      css: ['app.css'],
      inject: false, // we use custom template to inject scripts,
      hash: true,
      env: {
        Widget: false,
        Prod: true,
        Dev: false
      },
      minify: { // Minifying it while it is parsed
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
    }),
    //separate html file for widgets
    new HtmlWebpackPlugin({
      filename: 'widgets/index.html',
      chunks: ['widgets', 'vendor'],
      css: ['app.css'],
      title: 'RCN.io Widgets',
      template: path.resolve(consts.SRC_DIR, 'client/index.html.ejs'), // Load a custom template
      inject: false, // we use custom template to inject scripts,
      hash: false,
      env: {
        Widget: true,
        Prod: true,
        Dev: false
      },
      minify: { // Minifying it while it is parsed
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
    })

  ],
  resolve: {
    root: [
      //path.resolve(__dirname, 'src/'),
      path.resolve(__dirname, 'src/client'),
      path.resolve(__dirname, 'src/')
    ],
    //tells webpack to use static file when import React from 'react' is used
    alias: commonConfig.resolve.alias
  },
  module: {
    /* tells webpack to skip parsing following libraries
     requires use of "import loader" for certain modules, based on https://github.com/christianalfoni/react-webpack-cookbook/issues/30
    */
    noParse: commonConfig.module.noParse,
    loaders: [{
      test: pathToReactDOM,
      loader: 'imports'
    }, {
      test: pathToReactRouter,
      loader: 'imports'
    }, {
      test: pathToMomentTimezone,
      loader: 'imports'
    }, {
      test: /\.(js|jsx?)$/,
      loader: 'babel',
      exclude: /(node_modules|bower_components)/,
      include: path.join(consts.SRC_DIR),
      query: {
        presets: ['react', 'es2015', 'stage-2'],
        cacheDirectory: false,
        compact: true, //so babel wont output whitespaces and stuff, speeds up build a little
        plugins: [
          'transform-react-constant-elements', //compile-time optimizations
          'transform-react-inline-elements' //compile-time optimizations
        ]
      }
    }, {
      test: /\.scss$/,
      loaders: ['style', ExtractTextPlugin.extract('css!postcss!sass')],
      //loaders: ['style', 'css?localIdentName=[name]_[local]_[hash:base64:3]', 'sass'],
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
  postcss: function() {
    return [
      require('autoprefixer')({
        remove: true, //enabling of removal of outdated prefixes, just in case
        browsers: ['last 2 versions']
      })
    ]
  }
}
