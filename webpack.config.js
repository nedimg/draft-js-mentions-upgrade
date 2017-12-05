/* global __dirname, require, module, process */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const parts = require('./webpack/parts');
const pkg = require('./package.json');

const PATHS = {
    app: path.resolve(__dirname, './src/index.js'),
    build: path.resolve(__dirname, './dist'),
};

const common = {
    entry: {
        app: PATHS.app,
        vendor: Object.keys(pkg.dependencies),
    },
    output: {
        path: PATHS.build,
        filename: '[name].js',
        publicPath: '/',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader', 'eslint-loader'],
            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader', // creates style nodes from JS strings
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS
                }, {
                    loader: 'less-loader', // compiles Less to CSS
                }],
                // TODO: https://github.com/webpack-contrib/less-loader, https://github.com/postcss/postcss-loader
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'My Application',
            template: 'src/index.html',
        }),
    ],
};

let config;

// Detect how npm is run and branch based on that
switch (process.env.npm_lifecycle_event) {
case 'build':
    config = merge(
        common,
        parts.setFreeVariable(
            'process.env.NODE_ENV',
            'production'
        ),
        parts.extractBundle({
            name: 'vendor',
        }),
        parts.minify()
    );
    break;
default:
    config = merge(
        common,
        {
            devtool: 'source-map',
            stats: { colors: true },
        },
        parts.devServer({
            // Customize host/port here if needed
            host: process.env.HOST,
            port: process.env.PORT || 3000,
        })
    );
}

module.exports = config;
