const path = require('path');

const ABSOLUTE_BASE = path.normalize(__dirname);

const constants = Object.freeze({
  ABSOLUTE_BASE: ABSOLUTE_BASE,
  SRC_DIR: path.join(ABSOLUTE_BASE, 'src'),
  DEV_SERVER_PORT: 8888
});


module.exports = constants;
