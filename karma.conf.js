const path = require('path')
const webpack = require('webpack')

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],
    files: [
      'test/unit-client/setup.js',
      'test/unit-client/**/*.spec.js'
    ],
    reporters: ['spec', 'coverage-istanbul'],
    preprocessors: {
      'test/unit-client/setup.js': ['webpack'],
      'test/unit-client/**/*.spec.js': ['webpack']
    },
    singleRun: true,
    webpack: {
      devtool: 'inline-cheap-module-source-map',
      resolve: {
        extensions: ['.js', '.vue'],
        alias: {
          'vue$': 'vue/dist/vue.esm.js',
          '@': path.join(__dirname, 'client')
        }
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
          },
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          }
        ]
      },
      plugins: [
        new webpack.EnvironmentPlugin({
          NODE_ENV: 'test',
          DEBUG: true
        })
      ]
    },
    webpackMiddleware: {
      noInfo: true
    },
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text'],
      dir: path.join(__dirname, 'coverage-client'),
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: false
    }
  })
}
