const path = require('path')
const consts = require('./constants')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

exports.nodeModules = function(pathName) {
  return path.resolve(path.join(consts.NODE_MODULES, pathName))
}

//adds bundle analyzer plugin, mutates webpack config
exports.addBundleAnalyzer = function(webpackConfig) {
  webpackConfig.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerPort: 8881,
    })
  )

  return webpackConfig
}
