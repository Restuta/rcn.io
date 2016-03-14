const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const consts = require('./webpack/constants')
const nodeModules = require('./webpack/utils').nodeModules


const pathToReact = nodeModules('react/dist/react.min.js')
const pathToReactDOM = nodeModules('react-dom/dist/react-dom.min.js')
const pathToReactRouter = nodeModules('react-router/umd/ReactRouter.min.js')
const pathToMomentJs = nodeModules('moment/min/moment.min.js')

//TODO: extract common pieces of config to /webpack/common-config.js so we can reuse them
//between dev and prod configs without duplicaiton


module.exports = {
  //devtool: 'source-map',
  devtool: 'cheap-module-source-map',

  cache: false,
  debug: false,

  entry: {
    app: [
      path.join(consts.SRC_DIR, 'client/index.js')
    ],
    vendor: ['react', 'react-dom', 'react-router', 'moment', 'classnames', 'react-pure-render',
      'svg-inline-react'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity
    }),
    //TODO: try it out when app will grow
    //new webpack.optimize.DedupePlugin(),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('app.css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,  // eslint-disable-line camelcase
        warnings: false,
        //dead_code: true
      }
    })
  ],
  resolve: {
    root: [
      //path.resolve(__dirname, 'src/'),
      path.resolve(__dirname, 'src/client')
    ],
    //tells webpack to use static file when import React from 'react' is used
    alias: {
      'react': pathToReact,
      'react-dom': pathToReactDOM,
      'react-router': pathToReactRouter,
      'moment': pathToMomentJs
    }
  },
  module: {
    /* tells webpack to skip parsing following libraries
     requires use of "import loader" for certain modules, based on https://github.com/christianalfoni/react-webpack-cookbook/issues/30
    */
    noParse: [
      pathToReact,
      pathToReactDOM,
      pathToReactRouter,
      pathToMomentJs
    ],
    loaders: [{
      test: pathToReactDOM,
      loader: 'imports'
    }, {
      test: pathToReactRouter,
      loader: 'imports'
    }, {
      test: /\.(js|jsx?)$/,
      loader: 'babel',
      exclude: /(node_modules|bower_components)/,
      include: [
        path.join(consts.SRC_DIR, 'client'),
      ],
      query: {
        presets: ['react', 'es2015', 'stage-2'],
        cacheDirectory: false,
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
      test: /\.svg$/,
      loader: 'svg-inline'
    }]
  },
  //required to have proper rem to px calcualtion, default floating point precision is not enough
  //since most browsers use 15, SASS only uses 5, this leads to calculated size in px like 38.0001px
  sassLoader: {
    precision: 15
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
