const CopyPlugin = require('copy-webpack-plugin');

const path = require('path');

module.exports = {
    entry: [path.resolve(__dirname, 'src/index.js')],

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
    devServer: {
        port: 3333,
        publicPath: '/',
        historyApiFallback: true,
        hot: true,
        contentBase: [path.resolve(__dirname, 'dist')],
    },
    devtool: 'source-map',

    module: {
        rules: [{
            test: /\.sass$/,
            use: [
                'style-loader',
                // Translates CSS into CommonJS
                'css-loader',
                // Compiles Sass to CSS
                'sass-loader',

            ],
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ['@babel/preset-env', "@babel/react"],
                },
            }
        }]
    },

    plugins: [
        new CopyPlugin([{
            from: path.resolve(__dirname, 'src/index.html'),
            to: path.resolve(__dirname, 'dist/index.html'),
        }]),
    ],
};
