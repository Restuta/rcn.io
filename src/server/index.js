/* eslint-disable*/
//eslint is disabled to preserve babel config formatting that is easier to copy-paste from .babelrc

require('babel-register')({
  //see https://babeljs.io/docs/usage/options/#options for more config options
  babelrc: false,
  "presets": ["es2015-node6", "react", "stage-2"],
  "plugins": ["add-module-exports"],
  "env": {
    "production": {
      "plugins": [
        "transform-react-constant-elements",
        "transform-react-inline-elements",
        // "remove-webpack",
        // "remove-webpack-loaders"
      ]
    }
  }
})

//to eliminate the risk of buggy native Object.assign implementation, see https://github.com/facebook/react/issues/6451#issuecomment-212154690
Object.assign = require('object-assign')

require('babel-polyfill')
require('./server')
