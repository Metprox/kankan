const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');

const paths = require('./paths');
const base = require('./webpack.config.base.js');

module.exports = merge(base, {
  entry: [paths.appIndexJs],
  mode: 'development',
  devtool: 'eval',
  devServer: {
    port: 8080,
    historyApiFallback: false,
    open: true,
    hot: true,
    publicPath: '/',
    contentBase: './src',
    watchContentBase: true,
    stats: {
      colors: true,
    },
    overlay: {
      warnings: false,
      errors: false,
    },
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [autoprefixer()],
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(paths.appSrc),
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(css|scss)$/,
        include: [path.resolve(paths.appSrc)],
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
});
