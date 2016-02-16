const path = require('path')
const webpack = require('webpack')
const consts = require('./constants')

function resolveNodeModulesPath(pathName) {
  return path.resolve(path.join(consts.NODE_MODULES, pathName))
}

//NOTE: use min versions for prod and to speed-up build times a little
const pathToReact = resolveNodeModulesPath('react/dist/react.js')
const pathToReactDOM = resolveNodeModulesPath('react-dom/dist/react-dom.js')
const pathToReactRouter = resolveNodeModulesPath('react-router/umd/ReactRouter.min.js')

//const pathToReact = resolveNodeModulesPath('react/dist/react.min.js');
//const pathToReactDOM = resolveNodeModulesPath('react-dom/dist/react-dom.min.js');



module.exports = {
  // cheap-module-eval-source-map, because we want original source, but we don't
  // care about columns, which makes this devtool faster than eval-source-map.
  // http://webpack.github.io/docs/configuration.html#devtool

  devtool: 'eval',
  //devtool: 'cheap-module-eval-source-map',

  cache: true,
  debug: true,

  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    path.join(consts.SRC_DIR, 'client/index.js')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
  ],
  resolve: {
    root: [
      path.resolve(__dirname, 'src/')
    ],
    //tells webpack to use static file when import React from 'react' is used
    alias: {
      'react': pathToReact,
      'react-dom': pathToReactDOM,
      'react-router': pathToReactRouter
    }
  },
  module: {
    /* tells webpack to skip parsing following libraries
     requires use of "import loader" for certain modules, based on https://github.com/christianalfoni/react-webpack-cookbook/issues/30
    */
    noParse: [pathToReact, pathToReactDOM, pathToReactRouter],

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
      loaders: ['style', 'css?localIdentName=[name]_[local]_[hash:base64:3]', 'sass'],
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
  }
}
