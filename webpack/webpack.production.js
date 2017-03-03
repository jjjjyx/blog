const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const getEntries = require('./getEntries')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
let entry = getEntries("./client/src/**/c.*.js")
let chunks = Object.keys(entry);
const developmentConf = merge(baseConfig, {
    entry,
    stats: { children: false, warnings: false },
    devtool: 'cheap-module-source-map',
    plugins: [
        new CleanWebpackPlugin(['../public'],{
            exclude: ["preloader.css","favicon.ico",'editormd','Moxie.swf']
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            chunks: chunks.filter((item) => item.indexOf('bg') != 0), // chunks是需要提取的模块
            minChunks: 2
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'bg.vendor',
            chunks: chunks.filter((item) => item.indexOf('bg') == 0), // chunks是需要提取的模块
            minChunks: 2
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true,
            minimize: true
        }),
        new ExtractTextPlugin({
            filename:'[name].css',
            allChunks: true
        }),
        new webpack.LoaderOptionsPlugin({
            vue: {
                postcss: [
                    require('autoprefixer')({
                        browsers: ['last 3 versions']
                    })
                ]
            }
        })
    ]
})

module.exports = developmentConf
