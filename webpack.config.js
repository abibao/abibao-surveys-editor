const path = require('path')

const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    bundle: path.resolve(__dirname, 'client/main.js'),
    'vendors': [
      'debug', 'is_js',
      'vue', 'vuex', 'vue-router', 'vue-feathers', 'vue-cookie', 'vue-js-modal', 'v-tooltip', 'vue-select',
      'feathers/client', 'feathers-hooks', 'feathers-authentication/client', 'feathers-socketio/client', 'socket.io-client'
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.css'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.join(__dirname, 'client')
    }
  },
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: '[name].min.js'
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'bundle',
      filename: 'bundle.min.js',
      minChunks: Infinity
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: true
    }),
    new ExtractTextPlugin('bundle.min.css')
  ]
}
