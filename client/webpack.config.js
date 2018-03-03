const path = require('path'),
      webpack = require('webpack'),
      workboxPlugin = require('workbox-webpack-plugin'),
      outputDir = path.resolve(__dirname,'dist');

module.exports = {
    devServer: {
      inline: true,
      contentBase: './dist',
      port: 3001,
      proxy: { "/api/**": { target: 'http://localhost:3000', secure: false }  }
    },
    devtool: 'cheap-module-eval-source-map',
    entry: path.resolve(__dirname,'app/index.js'),
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
    node: {
      console: true,
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    output: {
        path: outputDir,
        publicPath:'/',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new workboxPlugin({
            globDirectory: outputDir,
            globPatterns: ['**/!(*map*)'],
            swDest:path.join(outputDir, 'service-worker.js'),
            clientsClaim:true,
            skipWaiting:true,
            runtimeCaching:[{
                urlPattern: new RegExp('/.*\/(bundle.js)/'),
                handler:'networkFirst'
            }],
            maximumFileSizeToCacheInBytes: 15000000
        })
    ]
};
