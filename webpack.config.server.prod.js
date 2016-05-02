const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
//const HtmlWebpackPlugin = require('html-webpack-plugin')
const consts = require('./webpack/constants')
const nodeModules = require('./webpack/utils').nodeModules
const nodeExternals = require('webpack-node-externals')

//TODO: extract common pieces of config to /webpack/common-config.js so we can reuse them
//between dev and prod configs without duplicaiton

const pathToReact = nodeModules('react/dist/react.min.js')
const pathToReactDOM = nodeModules('react-dom/dist/react-dom.min.js')
const pathToReactRouter = nodeModules('react-router/umd/ReactRouter.min.js')
const pathToMomentJs = nodeModules('moment/min/moment.min.js')


module.exports = {
  //devtool: 'source-map',
  // devtool: 'cheap-module-source-map',
  devtool: 'cheap-module-source-map',
  target: 'node',
  cache: false,
  debug: false,

  externals: [nodeExternals()],

  entry: { app: path.join(consts.SRC_DIR, 'client/getRoutes.js')},
  output: {
    path: path.join(__dirname, 'dist-server'),
    filename: '[name].server.bundle.js',
    libraryTarget: 'commonjs2',
    //publicPath: '/dist/'
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
    new ExtractTextPlugin('app.css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,  // eslint-disable-line camelcase
        warnings: false,
      }
    }),
    //used to ignore certain modules that we don't need on the server, so we don't waste time building them
    new webpack.NormalModuleReplacementPlugin(/\.(css|scss)$/, 'node-noop')
  ],
  resolve: {
    root: [
      //path.resolve(__dirname, 'src/'),
      path.resolve(__dirname, 'src/client')
    ],
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
      test: /\.(js|jsx?)$/,
      loader: 'babel',
      exclude: /(node_modules|bower_components)/,
      include: [
        path.join(consts.SRC_DIR, 'client'),
      ],
      query: {
        presets: ['react', 'es2015', 'stage-2'],
        cacheDirectory: false,
        plugins: [
          'transform-react-constant-elements', //compile-time optimizations
          'transform-react-inline-elements' //compile-time optimizations
        ]
      }
    }, {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      exclude: /(node_modules|bower_components)/,
      loaders: ['url?limit=10000&mimetype=application/font-woff'],
      include: path.join(consts.SRC_DIR, 'client')
    }, {
      test: /\.svg$/,
      loader: 'svg-inline'
    }, {
      test: /\.(jpg|jpeg|gif|png|ico)$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'file-loader?name=[path][name].[ext]&context=' + consts.IMG_DIR
    }]
  },
}
