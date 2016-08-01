/* contains common configorations for webpack configs */
const nodeModules = require('./utils').nodeModules

const getConfig = env => {
  const getPaths = ({prod, dev}) => ({prod: nodeModules(prod), dev: nodeModules(dev)})

  //define all vendor depnencies with pathes relative to node_modules/
  //that are pre-compiled, this allows to configure webpack to skip parsing of them
  //and this would speed up the build
  const preBuiltVendorDeps = {
    'react': {
      path: getPaths({
        prod: 'react/dist/react.min.js',
        dev:  'react/dist/react.js'
      })
    },
    'react-dom': {
      path: getPaths({
        prod: 'react-dom/dist/react-dom.min.js',
        dev:  'react-dom/dist/react-dom.js'
      })
    },
    'react-router': {
      path: getPaths({
        prod: 'react-router/umd/ReactRouter.min.js',
        dev:  'react-router/umd/ReactRouter.min.js' //deosn't work in dev with non-min version
      })
    },
    'react-router-redux': {
      path: getPaths({
        prod: 'react-router-redux/dist/ReactRouterRedux.min.js',
        dev:  'react-router-redux/dist/ReactRouterRedux.min.js'
      })
    },
    'redux': {
      path: getPaths({
        prod: 'redux/dist/redux.min.js',
        dev:  'redux/dist/redux.js'
      })
    },
    'moment': {
      path: getPaths({
        prod: 'moment/min/moment.min.js',
        dev:  'moment/moment.js'
      })
    },
    'moment-timezone': {
      path: getPaths({
        prod: 'moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js',
        dev:  'moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js',
      }),
      // noParse: true //moment-timezone uses "require()", so can't be ignored
    },
    'regenerator-runtime/runtime' : {
      path: getPaths({
        prod: 'regenerator-runtime/runtime.js',
        dev: 'regenerator-runtime/runtime.js'
      }),
      // noParse: true
    }
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
    'reselect'
  ]

  const toArray = (obj) => {
    return Object.keys(obj).map(key => {
      return Object.assign({
        name: key
      }, obj[key])
    })
  }

  const buildResolveAliases = vendorDeps =>
    Object.keys(vendorDeps)
      .map(depName => ({
        //$ is used to exactly match dependency
        [depName + '$']: vendorDeps[depName].path[env]
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
        .filter(dep => dep.noParse !== false)
        .map(dep => dep.path[env])
    }
  }
}

module.exports = {
  getConfig: getConfig
}
