// config-overrides.js

const { babelInclude, override } = require('customize-cra');
const path = require('path');

module.exports = {
  webpack: override(
    babelInclude([
      path.resolve('src'),
      path.resolve('node_modules/@react-leaflet'),
      path.resolve('node_modules/react-leaflet')
    ])
    // and configure other stuff here like csp-html-webpack-plugin
  ),
};