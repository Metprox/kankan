const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var ImageminPlugin = require('imagemin-webpack-plugin').default;
const paths = require('./paths');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      favicon: `${paths.appSrc}/favicon.ico`,
      cache: false,
    }),
    new CopyWebpackPlugin([
      {
        from: `${paths.appAssets}/images/`,
        to: `assets/images/`,
      },
      {
        from: `${paths.appAssets}/fonts/`,
        to: `assets/fonts/`,
      },
      {
        from: `${paths.appAssets}/svg/`,
        to: `assets/svg/`,
      },
    ]),
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production',
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: {
        quality: '95-100',
      },
    }),
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'md4',
      hashDigest: 'base64',
      hashDigestLength: 8,
    }),
  ],
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    hints: false,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules'],
    alias: {
      '@': path.resolve(paths.appSrc),
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jp(g|ge)?|gif|webp)$/,
        use: [
          {
            loader: 'cache-loader',
          },
          {
            loader: 'file-loader',
          },
          {
            loader: 'image-webpack-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'cache-loader',
          },
          {
            loader: '@svgr/webpack',
          },
        ],
      },
      {
        test: /\.(woff(2)?|eot|ttf)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'cache-loader',
          },
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
    noParse: /lodash\/lodash.js/,
  },
};
