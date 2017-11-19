const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')

webpackConfig.plugins[0] = new webpack.EnvironmentPlugin({
  NODE_ENV: 'production',
  DEBUG: false
})

module.exports = webpackConfig
