const path = require('path')
const webpack = require('webpack')
const consts = require('./webpack/constants')
const nodeModules = require('./webpack/utils').nodeModules
const HtmlWebpackPlugin = require('html-webpack-plugin')
const getConfig = require('./webpack/common-config').getConfig
const commonConfig = getConfig('dev')

//NOTE: use min versions for prod and to speed-up build times a little
const pathToReactDOM = nodeModules('react-dom/dist/react-dom.js')
const pathToReactRouter = nodeModules('react-router/umd/ReactRouter.min.js')
const pathToMomentTimezone = nodeModules('moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js')

module.exports = {
  // cheap-module-eval-source-map, because we want original source, but we don't
  // care about columns, which makes this devtool faster than eval-source-map.
  // http://webpack.github.io/docs/configuration.html#devtool

  devtool: 'eval',
  // devtool: 'cheap-module-eval-source-map',

  cache: true,
  debug: true,

  entry: {
    app: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
      path.join(consts.SRC_DIR, 'client/index.js'),
    ],
    //adding other deps for dev build to vendor chunk to speed up build
    vendor: commonConfig.entry.vendor.concat([
      // path.join(consts.SRC_DIR, 'client/temp/data/2016-mtb'),
      // path.join(consts.SRC_DIR, 'client/temp/data/2016-mtb-manual'),
      // path.join(consts.SRC_DIR, 'client/temp/data/2016-ncnca-events'),
      // path.join(consts.SRC_DIR, 'client/styles/bootstrap.scss'),
      // path.join(consts.SRC_DIR, 'client/app.scss'),
    ]),
    widgets: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
      path.join(consts.SRC_DIR, 'client/widgets/index.js')
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      // chunks: ['vendor'],
      minChunks: Infinity
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      },
      '__ENV' : {
        'Prod': false,
        'Dev': true
      }
    }),
    new HtmlWebpackPlugin({
      filename: consts.INDEX_HTML,
      chunks: ['app', 'vendor'],
      title: 'rcn',
      template: path.resolve(consts.SRC_DIR, 'client/index.html.ejs'), // Load a custom template
      inject: false, // we use custom template to inject scripts,
      hash: false,
      env: {
        Widget: false,
        Prod: false,
        Dev: true
      }
    }),
    //separate html file for widgets
    new HtmlWebpackPlugin({
      filename: 'widgets/index.html',
      chunks: ['widgets', 'vendor'],
      title: 'rcn/widgets',
      template: path.resolve(consts.SRC_DIR, 'client/index.html.ejs'), // Load a custom template
      inject: false, // we use custom template to inject scripts,
      hash: false,
      env: {
        Widget: true,
        Prod: false,
        Dev: true
      }
    })
  ],
  resolve: {
    root: [
      //path.resolve(__dirname, 'src/'),
      path.resolve(__dirname, 'src/client'),
      path.resolve(__dirname, 'src/')
    ],
    //tells webpack to use static file when import x from 'x' is used
    alias: commonConfig.resolve.alias
  },
  module: {
    /* tells webpack to skip parsing following libraries
     requires use of "import loader" for certain modules, based on https://github.com/christianalfoni/react-webpack-cookbook/issues/30
    */
    noParse: commonConfig.module.noParse
      .concat([
        path.join(consts.SRC_DIR, 'client/temp/data/2016-mtb'),
        path.join(consts.SRC_DIR, 'client/temp/data/2016-mtb-manual'),
        path.join(consts.SRC_DIR, 'client/temp/data/2016-ncnca-events'),
      ]),
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
  postcss: function() {
    return [
      // require('autoprefixer')({
      //   remove: false, //disabling of removal of outdated prefixes to make autoprefixer 10% faster
      //   browsers: ['last 2 versions']
      // })
    ]
  }
}
