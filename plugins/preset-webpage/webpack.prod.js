const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  // No source maps in the production bundle: the .map file isn't served in
  // some deployment environments, and a sourceMappingURL comment pointing
  // at a missing .map causes a 404 there.
  devtool: false,
});
