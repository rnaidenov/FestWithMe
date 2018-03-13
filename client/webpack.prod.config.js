const path = require('path'),
      webpack = require('webpack'),
      workboxPlugin = require('workbox-webpack-plugin'),
      CompressionPlugin = require('compression-webpack-plugin'),
      outputDir = path.resolve(__dirname, 'dist'),
      BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;



module.exports = {
  devtool: 'cheap-module-eval-source-map',
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
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          APPLICATION_API_BASE_URL: JSON.stringify("/")
        }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false, 
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true
      },
      output: {
        comments: false,
      },
      exclude: [/\.min\.js$/gi] 
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoErrorsPlugin(),
    new workboxPlugin({
      globDirectory: outputDir,
      globPatterns: ['**/!(*map*)'],
      swDest: path.join(outputDir, 'service-worker.js'),
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [{
        urlPattern: new RegExp('/.*\/(bundle.js)/'),
        handler: 'networkFirst'
      }]
    }),
    new BundleAnalyzerPlugin(),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};