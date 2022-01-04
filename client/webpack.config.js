const path = require('path'),
      webpack = require('webpack'),
      workboxPlugin = require('workbox-webpack-plugin'),
      outputDir = path.resolve(__dirname,'dist');
module.exports = {
    mode: 'development',
    devServer: {
      static: './dist',
      port: 3001,
      proxy: { "/api/**": { target: 'http://localhost:3000', secure: false }  }
    },
    devtool: 'eval-cheap-module-source-map',
    entry: path.resolve(__dirname,'app/index.js'),
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                  // TODO:
                  // plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy','transform-async-to-generator'],
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
            },
            {
              test: /\.json$/,
              loader: 'json-loader'
            },
            {
            test: /\.(png|jpg|gif|svg|ttf|eot|ico|woff|woff2)$/,
            loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
        ]
    },
    output: {
        path: outputDir,
        publicPath:'/',
        filename: 'bundle.js'
    },
    plugins: [
      new webpack.DefinePlugin({
          "process.env": {
            APPLICATION_API_BASE_URL: JSON.stringify("http://localhost:3000/")
          }
      })  
    ]
};
