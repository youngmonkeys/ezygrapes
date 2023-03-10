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
    clean: true,
  },
  externals: {'ezygrapes': 'ezygrapes'},
};
