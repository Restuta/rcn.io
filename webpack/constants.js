const path = require('path')

const ABSOLUTE_BASE = path.normalize(path.resolve(__dirname, '..'))

const constants = Object.freeze({
  ABSOLUTE_BASE: ABSOLUTE_BASE,
  SRC_DIR: path.join(ABSOLUTE_BASE, 'src'),
  IMG_DIR: path.join(ABSOLUTE_BASE, 'src/client/public/img'),
  NODE_MODULES: path.join(ABSOLUTE_BASE, 'node_modules'),
  DEV_SERVER_PORT: 8888,
  INDEX_HTML: 'generated.index.html'
})


module.exports = constants
