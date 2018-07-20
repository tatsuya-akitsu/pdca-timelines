const path = require('path');

const MODE = 'development';
const enabledSourceMap = (MODE === 'development');

const config = {
  mode: MODE,
  entry: './src/js/index.js',
  output: {
    filename: 'index.bundle.js',
    path: path.join(__dirname, 'public/js'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: true,
              sourceMap: enabledSourceMap,
              importLoaders: 2
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: enabledSourceMap,
            }
          }
        ],
      },
      {
        test: /\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
        loader: 'url-loader'
      }
    ],
  },
}

module.exports = config;
