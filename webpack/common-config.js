/* contains common configorations for webpack configs */
const nodeModules = require('./utils').nodeModules

const getConfig = () => {
  //define all vendor depnencies with pathes relative to node_modules/
  //that are pre-compiled, this allows to configure webpack to skip parsing of them
  //and we can use them for prod build instead of minifying libs ourself we would use pre-combiled ones
  const preBuiltVendorDeps = {
    'react': nodeModules('react/dist/react.min.js'),
    'react-dom': nodeModules('react-dom/dist/react-dom.min.js'),
    'react-router': nodeModules('react-router/umd/ReactRouter.min.js'),
    'react-router-redux': nodeModules('react-router-redux/dist/ReactRouterRedux.min.js'),
    'redux': nodeModules('redux/dist/redux.min.js'),
    'moment': nodeModules('moment/min/moment.min.js'),
    'moment-timezone': nodeModules('moment-timezone/builds/moment-timezone-with-data.min.js'),
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
        const key = Object.keys(b)[0] //we know that it has only key
        const value = b[key]

        a[key] = value
        return a
      })

  return {
    entry: {
      vendor: Object.keys(preBuiltVendorDeps).concat(otherVendorDeps)
    },
    resolve: {
      alias: buildResolveAliases(preBuiltVendorDeps)
    },
    module: {
      noParse: toArray(preBuiltVendorDeps)
    }
  }
}

module.exports = {
  getConfig: getConfig
}
