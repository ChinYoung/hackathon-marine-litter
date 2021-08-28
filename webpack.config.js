const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

const devMode = process.env.NODE_ENV !== "production";

const config = {
  mode: !devMode ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    filename: 'index.[contenthash].js',
    path: path.resolve(__dirname, './docs'),
  },

  module: {
    rules: [
      {
        test: /\.(mp3)$/i,
        use: [
          {
            loader: 'file-loader',
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[contenthash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader'
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [devMode ? "style-loader" : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./index.html"
    })
  ].concat(devMode ? [] : [new MiniCssExtractPlugin({
    filename: "[name].[contenthash].css"
  })])
}

module.exports = config;
