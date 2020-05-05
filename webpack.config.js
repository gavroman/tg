const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
const IP_ADDRESS = process.env.NODE_IP || require('ip').address();

module.exports = {
    entry: ['@babel/polyfill', path.resolve(__dirname, 'src/index.js')],

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            Components: path.join(__dirname, 'src/components'),
            Libs: path.join(__dirname, 'src/libs'),
        },
    },
    devServer: isDev ? {
        host: IP_ADDRESS,
        port: 3333,
        publicPath: '/',
        historyApiFallback: true,
        hot: true,
        contentBase: [path.resolve(__dirname, 'dist'), path.resolve(__dirname, 'img')],
    } : {},
    devtool: isDev ? 'source-map' : false,

    module: {
        rules: [{
            test: /\.sass$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',

            ],
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/react'],
                },
            }
        }]
    },

    plugins: [
        new webpack.DefinePlugin({
            'IP_ADDRESS': JSON.stringify(IP_ADDRESS),
            'IS_PROD': JSON.stringify(!isDev),
        }),
        new CopyPlugin([{
            from: path.resolve(__dirname, 'src/index.html'),
            to: path.resolve(__dirname, 'dist/index.html'),
        }]),
    ],
};
