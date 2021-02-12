const
	  os = require('os')
	, path = require('path')
  	, webpack = require('webpack')
  	, MiniCssExtractPlugin = require('mini-css-extract-plugin')
  	// , TerserPlugin = require('terser-webpack-plugin')
  	// , workboxPlugin = require('workbox-webpack-plugin')
	, HtmlWebpackPlugin = require("html-webpack-plugin")
	, CopyWebpackPlugin = require('copy-webpack-plugin')
	, { CleanWebpackPlugin } = require('clean-webpack-plugin')

require('./host/core/shared.js');

module.exports = {
	target: 'node',
	mode  : 'development',
	entry : './client/Client.js',

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

			'./custom/',
			'./custom/iconjar/',
			'./custom/iconjar/classes/',
			'./custom/iconjar/classes/components/',
			'./custom/iconjar/classes/controllers/',
			'./custom/iconjar/classes/daos/',
			'./custom/iconjar/classes/entities/',
			'./custom/iconjar/classes/host/',
			'./custom/iconjar/classes/models/',
			'./custom/iconjar/classes/views/',
			'./custom/iconjar/dialogs/',
			'./custom/iconjar/lib/',

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
			custom            : path.resolve(__dirname, 'custom/'),
			client            : path.resolve(__dirname, 'client/'),
			helpers           : path.resolve(__dirname, 'custom/Helpers/'),
			iconjar           : path.resolve(__dirname, 'custom/iconjar/'),
			classes           : path.resolve(__dirname, 'custom/iconjar/classes/'),
			components        : path.resolve(__dirname, 'custom/iconjar/classes/components/'),
			controllers       : path.resolve(__dirname, 'custom/iconjar/classes/controllers/'),
			daos              : path.resolve(__dirname, 'custom/iconjar/classes/daos/'),
			models            : path.resolve(__dirname, 'custom/iconjar/classes/models/'),
			entities          : path.resolve(__dirname, 'custom/iconjar/classes/entities/'),
			views             : path.resolve(__dirname, 'custom/iconjar/classes/views/'),
			dialogs           : path.resolve(__dirname, 'custom/iconjar/dialogs/'),
			lib               : path.resolve(__dirname, 'custom/iconjar/lib/'),
			SelectionExporter : path.resolve(__dirname, 'custom/SelectionExporter/'),
			ThemeSwitcher     : path.resolve(__dirname, 'client/lib/ThemeSwitcher/ThemeSwitcher.js'),
			'client-helpers'  : path.resolve(__dirname, 'client/client-helpers.js'),
			Globals           : path.resolve(__dirname, 'client/lib/Globals.js'),
			"jquery-ui"       : path.resolve(__dirname, 'node_modules/jquery-ui'),
			modules           : path.resolve(__dirname, "node_modules")
		}
	},

	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9000
	},

	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				'csxs/*',
				{
					from : 'client/theme/css/**/*',
					to   : '',
					force: true
                },
                {
					from : 'client/theme/js/**/*',
					to   : '',
					force: true
				},
				{
					from : 'client/theme/font/**/*',
					to   : '',
					force: true
				},
				{
					from : 'client/theme/img/**/*',
					to   : '',
					force: true,
				},
				{
					from : 'client/theme/material-design-icons/iconfont/**/*',
					to   : '',
					force: true
				},
				{
					from : 'client/ContextMenu.json',
					to   : 'client/',
					force: true,
				},
				{
					from : 'client/JSX.js',
					to   : 'client/',
					force: true,
				},
				{
					from : 'client/lib/jsx-console/**/*',
					to   : '',
					force: true,
				},
				{
					from : 'custom/iconjar/dialogs/*',
					to   : '',
					force: true,
				},
				{
					from : 'custom/plugins.json',
					to   : 'custom/',
					force: true,
				},
				{
					from : 'custom/iconjar/functions.js',
					to   : 'custom/iconjar/',
					force: true,
				},
				{
					from : 'custom/iconjar/host.js',
					to   : 'custom/iconjar/',
					force: true,
				},
				{
					from : 'custom/iconjar/IconJarLicenses.js',
					to   : 'custom/iconjar/',
					force: true,
				},
				{
					from : 'custom/iconjar/IconJarMeta.js',
					to   : 'custom/iconjar/',
					force: true,
				},
				{
					from : 'custom/iconjar/dialogs/IconSetDialog.js',
					to   : 'custom/iconjar/',
					force: true,
				},
				{
					from : 'custom/SelectionExporter/*',
					to   : '',
					force: true,
				},

				{
					from : 'freebies/**/*',
					to   : '',
					force: true,
				},
				{
					from : '.debug',
					to : ''
				},
				{
					from : 'mason-icon.png',
					to : ''
				},
				{
					from : 'VERSION',
					to : ''
				},
				{
					from : 'mimetype',
					to : ''
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
		new MiniCssExtractPlugin({ filename: 'main.[chunkhash].css' }),
		new webpack.ProvidePlugin({
			$      : 'jquery',
			jQuery : 'jquery',
			"window.jQuery" : "jquery",
			$path  : 'path',
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
					path.resolve(__dirname, 'custom'),
					path.resolve(__dirname, 'custom/iconjar')
				],
				use: {
                    loader: 'babel-loader',
                    options: { "presets": ["@babel/preset-react"] }
				}
            },
			{
				test: /\.(s*)css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{ loader: 'css-loader' }
				],
			},
			{
				test: /client\/theme\/\.(s*)css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{ loader: 'style-loader' },
					'css-loader',
					'postcss-loader',
					'sass-loader'
				],
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                  // Disables attributes processing
                  attributes: false,
                },
            },
			{
				test: /client\/theme\/\.(woff(2)?|ttf|eot)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[contenthash].[ext]',
						outputPath: 'assets/fonts/',
						publicPath: 'assets/fonts/'
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
