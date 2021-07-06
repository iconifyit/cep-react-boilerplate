const
	  os = require('os')
	, path = require('path')
  	, webpack = require('webpack')
  	, MiniCssExtractPlugin = require('mini-css-extract-plugin')
	, HtmlWebpackPlugin = require("html-webpack-plugin")
	, CopyWebpackPlugin = require('copy-webpack-plugin')
	, { CleanWebpackPlugin } = require('clean-webpack-plugin')


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
			modules           : path.resolve(__dirname, "node_modules")
		}
	},

	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				'csxs/*',
                {
					from : 'client/lib/JSX.js',
					to   : 'client/lib/',
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
			fs     : 'fs',
            ThemeSwitcher       : 'client/lib/ThemeSwitcher/ThemeSwitcher.js',
            CSLib               : 'client/lib/CSInterface/CSInterface.js',
            jsxConsole          : 'client/lib/jsx-console/jsx-console.js',
            flyoutMenuImpl      : 'client/lib/FlyoutMenu/FlyoutMenuImpl.js',
            ContextMenuRouter   : 'client/lib/ContextMenuRouter/ContextMenuRouter.js',
            ContextMenuJSON     : 'client/lib/ContextMenuRouter/ContextMenuExample.json',
            // darkTheme           : 'client/theme/css/topcoat-desktop-dark.min.css',
            // lightTheme          : 'client/theme/css/topcoat-desktop-light.min.css',
            // styles              : 'client/theme/css/styles.css',
            // fontCss             : 'client/theme/font/stylesheet.css'
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
