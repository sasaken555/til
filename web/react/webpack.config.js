const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './client/src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'server/src/public/client-dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'API_BASE_PATH': JSON.stringify(process.env.API_BASE_PATH)
      }
    })
  ],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
};