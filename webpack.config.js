const
	  os = require('os')
	, path = require('path')
  	, webpack = require('webpack')
  	, MiniCssExtractPlugin = require('mini-css-extract-plugin')
	, HtmlWebpackPlugin = require("html-webpack-plugin")
	, CopyWebpackPlugin = require('copy-webpack-plugin')
	, { CleanWebpackPlugin } = require('clean-webpack-plugin')

require('./host/core/shared.js');

module.exports = {
	target: 'node',
	mode  : 'development',
	entry : './client/index.js',

	node: { fs: 'empty' },

	output : {
		filename : 'main.js',
		path     : path.resolve(__dirname, 'dist'),
	},

	resolve: {
		modules : [
			'./',
			'./node_modules/',
			'./lib/',

			'./client/',
			'./client/lib/',

			'./host/',
			'./host/core/'
		],
		extensions : ['.js', '.jsx', '.json'],
		alias : {
			root              : path.resolve(__dirname),
			host              : path.resolve(__dirname, 'host/'),
			core              : path.resolve(__dirname, 'host/core/'),
			client            : path.resolve(__dirname, 'client/'),
			ThemeSwitcher     : path.resolve(__dirname, 'client/lib/ThemeSwitcher/ThemeSwitcher.js'),
			'client-helpers'  : path.resolve(__dirname, 'client/client-helpers.js'),
			Globals           : path.resolve(__dirname, 'client/lib/Globals.js'),
			modules           : path.resolve(__dirname, "node_modules")
		}
	},

	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				'csxs/*',
                {
					from : 'client/JSX.js',
					to   : 'client/',
					force: true,
				},
				{
					from : '.debug',
					to : ''
				},
				{
					from : 'icons/**/*',
					to   : '',
					force: true
				}
			],
			options: {
				concurrency: 100,
			}
		}),
		new webpack.ProgressPlugin(),
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve(__dirname, "client/index.html"),
			filename: 'client/index.html'
		}),
		new MiniCssExtractPlugin({ 
            filename: 'client/theme/css/client.all.css'
         }),
		new webpack.ProvidePlugin({
			path  : 'path',
			fs     : 'fs'
		})
	],

	module : {
		rules: [
			{
				test: /.(js|jsx)$/,
				exclude: /node_modules/,
				include: [
					path.resolve(__dirname, 'client'),
				],
				use: {
                    loader: 'babel-loader',
                    options: { "presets": ["@babel/preset-react"] }
				}
            },
			{
                test: /\.css$/,
                use: [
                  {loader: MiniCssExtractPlugin.loader},
                  'css-loader',
                ],
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                  attributes: false,
                },
            },
            {
				test: /\.svg$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'client/theme/img/',
						publicPath: '../img/'
					}
				}
			},
			{
				test: /\.(woff(2)?|ttf|eot|otf)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'client/theme/font/',
						publicPath: '../font/'
					}
				}
			}
		]
	},

	// watch: true,
	watchOptions: {
		ignored: [/node_modules/]
	},

	externals:{
		fs:    "commonjs fs",
		path:  "commonjs path"
	}
};
