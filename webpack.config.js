var path = require('path')
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var Autoprefixer = require('Autoprefixer')

var extractCSS = new ExtractTextPlugin('css/[name].css')

module.exports = {
	context: __dirname,

	entry: {
		base: './assets/scripts/base',
	},

	output: {
		path: path.resolve('./assets/bundles/'),
		filename: '[name].js',
	},

	devtool: "source-map",

	module: {
		loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader', query: { presets: ['react'] } },
      { test: /\.scss$/, loader: extractCSS.extract("style-loader", 'css-loader!postcss-loader!sass-loader') },
		],
	},

  postcss: [ Autoprefixer({ browsers: ['last 2 versions'] }) ],

  plugins: [
    new BundleTracker({ filename: './webpack-stats.json', indent: 2 }),
    extractCSS,
  ],

  resolve: {
    modulesDirectories: ['node_modules',],
    extensions: ['', '.js', '.jsx', 'scss'],
  }
}