const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
	entry: {
		main: './assets/main.js'
	},
	resolve: {
		fallback: {
			fs: false
		}
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'assets/'
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
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ['js/*']
		}),
		new WebpackManifestPlugin({
			fileName: 'cache.manifest.json'
		})
	],
	optimization: {
		splitChunks: {
			cacheGroups: {
				jquery: {
					test: /[\\/]node_modules[\\/]((jquery).*)[\\/]/,
					name: 'jquery',
					chunks: 'all'
				},
				handlebars: {
					test: /[\\/]node_modules[\\/]((handlebars).*)[\\/]/,
					name: 'handlebars',
					chunks: 'all'
				},
				swiper: {
					test: /[\\/]node_modules[\\/]((swiper).*)[\\/]/,
					name: 'swiper',
					chunks: 'all'
				},
				vendors: {
					test(module) {

						const exclude = [
							'jquery',
							'handlebars',
							'swiper'
						];

						if (!module.context ||
							!module.context.includes('node_modules') ||
							exclude.some(str => module.context.includes(str))) {
							return false;
						}

						return true;
					},
					name: 'vendors',
					chunks: 'all'
				}
			}
		},
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: true
			}),
			new CompressionPlugin({
				test: /\.jp(e?)g$|\.png$|.svg$|\.js$|\.css(\?.*)?$/i,
				threshold: 860
			}),
			new CssMinimizerPlugin()
		]
	},
	output: {
		filename: 'js/[name].[contenthash].js',
		chunkFilename: 'js/[name].[contenthash].bundle.js',
		path: path.resolve(__dirname, 'public'),
		publicPath: ''
	}
};