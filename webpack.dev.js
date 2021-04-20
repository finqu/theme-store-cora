const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'source-map',
	devServer: {
		contentBase: 'public'
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: function () {
								return [require('precss'), require('autoprefixer')];
							}
						}
					},
					{
						loader: 'sass-loader'
					}
				]
			}
		]
	},
	watchOptions: {
		poll: 1000,
		ignored: ['node_modules']
	},
	plugins: [
		new LiveReloadPlugin({
			protocol: 'http',
			appendScriptTag: true,
			hostname: 'localhost'
		})
	]
});