'use strict'

const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const buildPath = path.resolve(__dirname, 'dist')
const contextPath = path.join(__dirname, '/client')
const entryPath = path.join(contextPath, '/app.js')

module.exports = {
  context: contextPath,
  entry: entryPath,
  resolve: ['', '.js', '.tag', 'css', 'png'],
  output: {
    path: buildPath,
    filename: 'js/bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      SurveyEditor: 'surveyjs-editor/dist/surveyeditor'
    }),
    new CopyWebpackPlugin([
      { from: contextPath + '/index.html', to: buildPath + '/index.html' }
    ])
  ],
  module: {
    noParse: ['riot'],
    preLoaders: [
      { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader', query: { type: 'babel' } }
    ],
    loaders: [
      { test: /\.js|\.tag$/, exclude: /node_modules/, include: /client/, loader: 'babel-loader', query: {cacheDirectory: true, presets: ['es2015']} },
      { test: /\.scss$/, loaders: 'style-loader!css-loader!sass-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader' }
    ]
  }
}
