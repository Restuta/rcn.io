const path = require('path')
const consts = require('./constants')

exports.nodeModules = function(pathName) {
  return path.resolve(path.join(consts.NODE_MODULES, pathName))
}
