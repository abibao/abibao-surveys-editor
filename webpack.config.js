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
    filename: '/js/bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
      ko: 'knockout',
      SurveyEditor: 'surveyjs-editor'
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
      { test: /\.js|\.tag$/, exclude: /node_modules/, include: path.join(contextPath), loader: 'babel-loader', query: {cacheDirectory: true, presets: ['es2015']} },
      { test: /\.scss$/, loaders: 'style-loader!css-loader!sass-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader' },
      { test: /\.(png|jpg|gif|svg)$/, exclude: /node_modules/, include: /client/, loader: 'url-loader?limit=8192&name=images/[hash].[ext]' },
      { test: /\.(woff|woff2|ttf|eot)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/, loader: 'file-loader?name=fonts/[name].[ext]' },
      { test: /\.(woff|woff2|ttf|eot|svg)(\?sbpmys)?$/, include: /node_modules/, loader: 'file-loader?name=fonts/[name].[ext]' }
    ]
  }
}
