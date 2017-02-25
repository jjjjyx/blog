const webpack = require('webpack');
const base = require('./webpack.base');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

const config = Object.assign({}, base, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env),
            'isBrowser': true
        })
    ]
});

if (env === 'production') {
    // config.plugins.splice(0,0,new CleanWebpackPlugin(['public'],{
    //     exclude: ["preloader.css","favicon.ico",'editormd']
    // }))
    config.plugins.push([
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ])
    config.devtool =  '#cheap-module-source-map';

}else{
    config.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ])
}
module.exports = config;
