const path = require('path'),
      webpack = require('webpack'),
      workboxPlugin = require('workbox-webpack-plugin'),
      outputDir = path.resolve(__dirname, 'dist');


module.exports = {
  devtool: false,
  entry: path.resolve(__dirname, 'app/index.js'),

  output: {
    path: outputDir,
    publicPath: '/',
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy','transform-async-to-generator'],
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production"),
          APPLICATION_API_BASE_URL: JSON.stringify("/")
        }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoErrorsPlugin(),
    new workboxPlugin({
      globDirectory: outputDir,
      globPatterns: ['**/!(*map*)'],
      swDest: path.join(outputDir, 'service-worker.js'),
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: new RegExp('.*.js.*'),
          handler: 'networkFirst'
        },
        {
          urlPattern: new RegExp('.*fonts.*'),
          handler: 'networkFirst'
        },
        {
          urlPattern: new RegExp('.*cloudinary.*'),
          handler: 'networkFirst'
        }
      ]
    })
  ]
};