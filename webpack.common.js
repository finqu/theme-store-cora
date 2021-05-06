const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
	entry: {
		main: ['core-js/stable', './assets/main.js']
	},
	node: {
		fs: 'empty'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				loaders: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'media/'
						}
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash].css'
		}),
		new CleanWebpackPlugin(['app/assets/dist']),
		new ManifestPlugin({
			fileName: 'cache.manifest.json'
		}),
		new webpack.ProvidePlugin({
	      $: path.resolve('./node_modules/jquery'),
	      jQuery: path.resolve('./node_modules/jquery'),
	      'window.jQuery': path.resolve('./node_modules/jquery'),
	      'window.$': path.resolve('./node_modules/jquery')
	    })
	],
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				cache: true,
				parallel: true,
				sourceMap: false,
				extractComments: false
			}),
			new CompressionPlugin({
				test: /\.jp(e?)g$|\.png$|.svg$|\.js$|\.css(\?.*)?$/i,
				threshold: 860
			}),
			new OptimizeCSSAssetsPlugin({})
		]
	},
	resolve: {
		alias: {}
	},
	output: {
		filename: 'js/[name].[contenthash].js',
		chunkFilename: 'js/[name].[contenthash].bundle.js',
		path: path.resolve(__dirname, 'public'),
		publicPath: ''
	}
};