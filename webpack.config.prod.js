const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const consts = require('./webpack/constants')

const getConfig = require('./webpack/common-config').getConfig
const commonConfig = getConfig('prod')

const extractCss = new ExtractTextPlugin('[name].css', {allChunks: true})
const htmlWebpackMinifyConfig = { // Minifying it while it is parsed
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
}

const config = {
  //devtool: 'source-map',
  devtool: 'cheap-module-source-map',
  target: 'web',

  cache: false,
  debug: false,

  entry: {
    app: [
      path.join(consts.SRC_DIR, 'client/index.js')
    ],
    widgets: [
      path.join(consts.SRC_DIR, 'client/widgets/index.js')
    ],
    admin: [
      path.join(consts.SRC_DIR, 'client/admin/index.js')
    ],
    vendor: commonConfig.entry.vendor.concat([
      path.join(consts.SRC_DIR, 'client/styles/bootstrap.scss'),
    ]),
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
    //order of chunks is important, first we define common chunks between app and widgets
    // new webpack.optimize.CommonsChunkPlugin({
    //   names: ['common'], //use this to enable extra common chunk
    //   // names: ['vendor'],
    //   filename: '[name].bundle.js',
    //   chunks: ['app', 'widgets'],
    //   // (with more entries, this ensures that no other module
    //   // goes into the vendor chunk)
    //   minChunks: 2, //set to 2 when enabling 'common' chunk
    // }),
    //second we extract all vendor deps to a separate chunk from our common chunk
    //defines explicit vendor chunks with pre-picked vendor dependencies
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'], //use this to enable extra common chunk
      // names: ['vendor'],
      filename: '[name].bundle.js',
      // chunks: ['common'], //if common chunk is defined above we can extract vendor deps from it
      // (with more entries, this ensures that no other module
      // goes into the vendor chunk)
      minChunks: 2,
    }),

    new webpack.optimize.DedupePlugin(),
    extractCss,
    new webpack.optimize.UglifyJsPlugin({
      minimize: false,
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
      chunks: ['vendor', 'app'],
      chunksSortMode: 'dependency',
      template: path.resolve(consts.SRC_DIR, 'client/index.html.ejs'), // Load a custom template
      inject: false, // we use custom template to inject scripts,
      hash: true,
      env: {
        Widget: false,
        Prod: true,
        Dev: false
      },
      minify: htmlWebpackMinifyConfig,
    }),
    // separate html file for widgets
    new HtmlWebpackPlugin({
      filename: 'widgets/index.html',
      chunks: ['vendor', 'widgets'],
      chunksSortMode: 'dependency',
      title: 'RCN.io Widgets',
      template: path.resolve(consts.SRC_DIR, 'client/index.html.ejs'), // Load a custom template
      inject: false, // we use custom template to inject scripts,
      hash: false,
      env: {
        Widget: true,
        Prod: true,
        Dev: false
      },
      minify: htmlWebpackMinifyConfig,
    }),
    // separate html file for admin
    new HtmlWebpackPlugin({
      filename: 'admin/index.html',
      chunks: ['vendor', 'admin'],
      chunksSortMode: 'dependency',
      title: 'rcn/admin',
      template: path.resolve(consts.SRC_DIR, 'client/admin/index.html.ejs'), // Load a custom template
      inject: false, // we use custom template to inject scripts,
      hash: false,
      env: {
        Admin: true,
        Prod: true,
        Dev: false
      },
      minify: htmlWebpackMinifyConfig,
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
    loaders: commonConfig.module.loaders.concat([{
      test: /\.scss$/,
      loaders: ['style', extractCss.extract('css!postcss!sass')],
      //loaders: ['style', 'css?localIdentName=[name]_[local]_[hash:base64:3]', 'sass'],
      exclude: /(node_modules|bower_components)/,
      include: path.join(consts.SRC_DIR, 'client')
    }])
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

module.exports = config

// const addBundleAnalyzer = require('./webpack/utils').addBundleAnalyzer
// module.exports = addBundleAnalyzer(config)
