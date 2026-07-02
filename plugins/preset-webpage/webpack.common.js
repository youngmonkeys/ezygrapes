const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package.json');
const name = pkg.name;

module.exports = {
  entry: ["regenerator-runtime/runtime.js", './src'],
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Production',
      template: "index.html",
    }),
  ],
  output: {
    filename: `${name}.min.js`,
    path: path.resolve(__dirname, 'dist'),
    // Keep CSS output (built separately via `build:css`/sass) from being wiped
    // by webpack's own clean step.
    clean: {
      keep: /\.css(\.map)?$/,
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }],
            ],
          }
        }
      }
    ]
  },
  externals: {'ezygrapes': 'grapesjs'},
  resolve: {
    alias: {
      '@grapesjs/core': path.resolve(__dirname, '../../packages/core'),
    }
  }
};
