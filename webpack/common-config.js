/* contains common configorations for webpack configs */
const nodeModules = require('./utils').nodeModules
const path = require('path')
const consts = require('./constants')

const pathToReactDOM = nodeModules('react-dom/dist/react-dom.min.js')
const pathToReactRouter = nodeModules('react-router/umd/ReactRouter.min.js')
const pathToMomentTimezone = nodeModules('moment-timezone/builds/moment-timezone-with-data.min.js')


const getConfig = (env) => {
  //define all vendor depnencies with pathes relative to node_modules/
  //that are pre-compiled, this allows to configure webpack to skip parsing of them
  //and we can use them for prod build instead of minifying libs ourself we would use pre-combiled ones
  const preBuiltVendorDeps = {
    'react': nodeModules('react/dist/react.min.js'),
    'react-dom': pathToReactDOM,
    'react-router': pathToReactRouter,
    'react-router-redux': nodeModules('react-router-redux/dist/ReactRouterRedux.min.js'),
    'redux': nodeModules('redux/dist/redux.min.js'),
    'moment': nodeModules('moment/min/moment.min.js'),
    'moment-timezone': pathToMomentTimezone,
    'redux-saga': nodeModules('redux-saga/dist/redux-saga.min.js'),
    //TODO: modify for node to pull node-fetch
    'isomorphic-fetch': nodeModules('whatwg-fetch/fetch.js')
  }


  //other non-prebuilt dependencies
  const otherVendorDeps = [
    'react-pure-render',
    'svg-inline-react',
    'classnames',
    'exenv',
    'react-modal2',
    'redux-actions',
    'react-redux',
    'reselect',
    // 'core-js/library/es6/promise'
  ]

  const toArray = (obj) => {
    return Object.keys(obj).map(key => obj[key])
  }

  const buildResolveAliases = vendorDeps =>
    Object.keys(vendorDeps)
      .map(depName => ({
        //$ is used to exactly match dependency
        [depName + '$']: vendorDeps[depName]
      }))
      //reducing array of objects to one object with "name$":"path" structure as required by Webpack
      .reduce((a, b) => {
        const key = Object.keys(b)[0] //we know that it has only one key
        const value = b[key]

        a[key] = value
        return a
      })


  const getLoaders = (env) => {
    let loaders = []

    if (env === 'prod') {
      loaders = loaders.concat([{
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
      }])
    }

    if (env === 'dev') {
      loaders = loaders.concat([{
        test: /\.(js|jsx?)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        include: [path.join(consts.SRC_DIR)],
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
      }])
    }

    //common loaders
    loaders = loaders.concat([{
      test: /\.json$/,
      loader: 'json-loader',
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
    }])

    return loaders
  }

  return {
    entry: {
      vendor: Object.keys(preBuiltVendorDeps).concat(otherVendorDeps)
    },
    resolve: {
      alias: buildResolveAliases(preBuiltVendorDeps)
    },
    module: {
      noParse: toArray(preBuiltVendorDeps),
      loaders: getLoaders(env),
    }
  }
}


module.exports = {
  getConfig: getConfig
}
