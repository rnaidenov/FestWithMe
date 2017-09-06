const path = require('path');
const webpack = require('webpack');


module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: path.resolve(__dirname,'app/index.js'),

  output: {
    path: path.resolve(__dirname,'dist/'),
    publicPath:'/',
    filename: 'bundle.js'
  },

  module: {
    loaders: [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
              plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
            },
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            loaders: ['style-loader','css-loader']
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
      'process.env': {
        // This tells the Webpack and Babel for optimization for performance
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.NoErrorsPlugin(), // Makes sure Webpack will not compile if Errors
  ]
};