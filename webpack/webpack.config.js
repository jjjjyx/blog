const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const getEntries = require('./getEntries')
const webpackHotMiddlewareConfig = 'webpack-hot-middleware/client?path=/static/__webpack_hmr&timeout=20000'
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let entry = getEntries("./client/**/c.*.js",webpackHotMiddlewareConfig)
console.log("entry:",entry)
const developmentConf = merge(baseConfig, {
    entry,
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
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
