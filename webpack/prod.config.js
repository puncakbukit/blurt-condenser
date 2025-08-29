
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const baseConfig = require('./base.config');
const path = require('path');

module.exports = {
  ...baseConfig,
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[contenthash].js',
    publicPath: './', // ✅ important for GitHub Pages
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    ...baseConfig.plugins,
    new HtmlWebpackPlugin({
      template: './src/index.html', // you’ll need to create this
      filename: 'index.html',
    }),
  ],
};

