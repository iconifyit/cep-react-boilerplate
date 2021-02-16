const path                   = require('path'),
      webpack                = require('webpack'),
      HtmlWebpackPlugin      = require('html-webpack-plugin'),
      MiniCssExtractPlugin   = require('mini-css-extract-plugin'),
      CopyWebpackPlugin      = require('copy-webpack-plugin'),
      { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode    : 'development',
    entry : {
        host : path.resolve(__dirname, 'host/index.jsx')
    },
    output : {
        filename : 'host.all.jsx',
        path     : path.resolve(__dirname, 'dist/host'),
    },
    plugins : [
        new CleanWebpackPlugin()
    ],
    module : {
        rules : [
            {
                test: /\.(js|jsx)$/,
                include: [
                    path.resolve(__dirname, 'host')
                ],
                exclude: [
                    /node_modules/,
                    /host\.all\.jsx/,
                    /Host\.jsx/,
                    /vendor/,
                    /core/
                ],
                use: {
                    loader: "babel-loader",
                    options: { "presets": [
                        "@babel/preset-react"
                    ] }
                }
            }
        ]
    },
    watch: false,
    watchOptions: {
        ignored: /node_modules/
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all'
    //     }
    // }
}