'use strict';

const path = require('path');

module.exports = {
  mode: "development",
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  resolve: {
    alias: {
      // root: path.resolve('./src'),
      // 'structures': path.resolve(__dirname, './src/structures'),
    }
  }
};
