const webpack = require('webpack');
const base = require('./webpack.base');

const path = require('path');

const getEntry = require("./getEntry");
// const values = require('postcss-modules-values')
const entries = getEntry('./client/src/**/s.*.js'); // 获得入口 js 文件

const env = process.env.NODE_ENV || 'development';

module.exports = Object.assign({}, base, {
    target: 'node',
    devtool: null,
    entry: entries,
    output: Object.assign({}, base.output, {
        path:  path.join(__dirname, '../dist'),
        filename: "[name].js",
        publicPath: '/',
        chunkFilename: '[id].[hash].js',
        libraryTarget: 'commonjs2', // !different
    }),
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env),
            'process.env.VUE_ENV': '"server"',
            'isBrowser': false
        })
    ]
});
