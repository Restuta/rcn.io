/* eslint-disable*/
//eslint is disabled to preserve babel config formatting that is easier to copy-paste from .babelrc


require('babel-register')({
  //see https://babeljs.io/docs/usage/options/#options for more config options
  babelrc: false,
  "presets": ["es2015-node5", "react", "stage-2"],
  // "plugins": ["add-module-exports"],
  // "env": {
  //   "production": {
  //     "plugins": [
  //       "transform-react-constant-elements",
  //       "transform-react-inline-elements",
  //       // "remove-webpack",
  //       // "remove-webpack-loaders"
  //     ]
  //   }
  // }
})
require('babel-polyfill')
