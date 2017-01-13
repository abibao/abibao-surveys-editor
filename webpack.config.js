'use strict'

const path = require('path')
const webpack = require('webpack')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

// const nodeModulesPath = path.resolve(__dirname, 'node_modules')
const buildPath = path.resolve(__dirname, 'dist')
const contextPath = path.join(__dirname, '/client')
const entryPath = path.join(contextPath, '/app.js')

module.exports = {
  context: contextPath,
  entry: entryPath,
  resolve: ['', '.js', '.tag', 'css', 'less', 'png'],
  output: {
    path: buildPath,
    filename: 'js/bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      riot: 'riot',
      $: 'jquery',
      toastr: 'toastr'
    })
    /* new HtmlWebpackPlugin({
      title: 'Abibao Service / Administrator',
      template: 'index.ejs'
    })*/
  ],
  module: {
    noParse: ['riot'],
    preLoaders: [
      { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader', query: { type: 'babel' } }
    ],
    loaders: [
      { test: /\.js|\.tag$/, exclude: /node_modules/, include: /client/, loader: 'babel-loader', query: {cacheDirectory: true, presets: ['es2015']} },
      { test: /\.html$/, loader: 'file?name=[name].[ext]' },
      { test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader' },
      { test: /\.(png|jpg|gif|svg)$/, include: path.join(contextPath, 'assets/img'), loader: 'url-loader?limit=8192&name=img/[hash].[ext]' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
    ]
  }
}
