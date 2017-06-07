var path = require('path');
var webpack = require('webpack');

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
                loaders: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.scss/,
                loader: 'style-loader!css-loader!sass-loader'
            },
            {
              test: /\.json$/,
              loader: 'json-loader'
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
        path: path.resolve(__dirname,'dist/'),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin()
    ]
};
