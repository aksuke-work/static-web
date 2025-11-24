const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

console.log(__dirname);

module.exports = {
    output: {
        path: path.resolve(__dirname, './public/js'),
        filename: '[name].js',
        chunkLoadingGlobal: 'webChunks',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    plugins: [new webpack.ProgressPlugin(), new CleanWebpackPlugin()],
};

