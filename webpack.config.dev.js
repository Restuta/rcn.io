const path = require('path')
const webpack = require('webpack')
const consts = require('./webpack/constants')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const outputPath = path.join(__dirname, 'dist')

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
    widgets: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
      path.join(consts.SRC_DIR, 'client/widgets/index.js')
    ]
  },
  output: {
    path: outputPath,
    filename: '[name].bundle.js',
    publicPath: '/dist'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['common'], //use this to enable extra common chunk
      // names: ['vendor'],
      filename: '[name].bundle.js',
      // chunks: ['vendor'],
      // (with more entries, this ensures that no other module
      // goes into the vendor chunk)
      minChunks: 2 //set to 2 when enabling 'common' chunk
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
      },
    }),
    new webpack.DllReferencePlugin({
      context: path.join(consts.SRC_DIR, 'client'),
      manifest: require(path.join(outputPath, 'vendor-manifest.json'))
    }),
    new HtmlWebpackPlugin({
      filename: consts.INDEX_HTML,
      chunks: ['common', 'app'],
      chunksSortMode: 'dependency',
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
      chunks: ['common', 'widgets'],
      chunksSortMode: 'dependency',
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
  },
  module: {
    /* tells webpack to skip parsing following libraries
     requires use of "import loader" for certain modules, based on https://github.com/christianalfoni/react-webpack-cookbook/issues/30
    */
    noParse: [
      path.join(consts.SRC_DIR, 'client/temp/data/2016-mtb'),
      path.join(consts.SRC_DIR, 'client/temp/data/2016-mtb-manual'),
      path.join(consts.SRC_DIR, 'client/temp/data/2016-ncnca-events'),
      path.join(consts.SRC_DIR, 'client/temp/data/2017-ncnca-events'),
    ],
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
  postcss: function() {
    return [
      // require('autoprefixer')({
      //   remove: false, //disabling of removal of outdated prefixes to make autoprefixer 10% faster
      //   browsers: ['last 2 versions']
      // })
    ]
  }
}
