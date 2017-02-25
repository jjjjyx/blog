const path = require('path');
const webpack = require("webpack");
const autoprefixer = require('autoprefixer');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const getEntry = require("./getEntry");
// const values = require('postcss-modules-values')
const entries = getEntry('./client/src/**/c.*.js'); // 获得入口 js 文件
const chunks = Object.keys(entries);

module.exports = {
    entry: entries,
    output: {
        // 文件地址
        path: path.join(__dirname, '../public'),
        // [name]这里是webpack提供的根据路口文件自动生成的名字
        filename: "[name].js",
        // 公共文件生成的地址
        publicPath: '/',
        chunkFilename: '[id].[hash].js'
    },
    // 服务器配置相关，自动刷新!
    devServer: {
        historyApiFallback: true,
        hot: false,
        inline: true,
        grogress: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    },
    module: {
        // 加载器
        loaders: [
            // 解析.vue文件
            {
                test: /\.vue$/,
                loader: 'vue',
                include: path.join(__dirname, '../client'),
            },
            // 转化ES6的语法
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
                // include: path.join(__dirname, '../client'),
                //
            },
            {
                test: /\.css$/,
                // loader: 'style!css',
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader'),
                // include: path.join(__dirname, './node_modules'),
            },
            // 自动编译 less 文件
            {
                test: /\.less$/,
                // loader: "style!css!postcss!less?sourceMap",
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader'),
                include: path.join(__dirname, '../client'),
            },
            // 图片转化，自动转化为base64的编码
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192',
                include: path.join(__dirname, '../client'),
            },
            // 加载字体
            {
                test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?name=fonts/[name]_[hash].[ext]'
            },
            // jquery fix
            {
                test: require.resolve('jquery'),
                loader: 'expose?$'
            }
        ]
    },
    vue: {
        loaders: {
            css: 'style!css!',
        }
    },
    // 转化成es6的语法
    babel: {
        presets: ['es2015', 'stage-2'],
        plugins: ['transform-runtime'],
        compact: false,
        cacheDirectory: true, //important for performance
    },
    postcss: function () {
        return [autoprefixer];
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
    },
    plugins: [
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
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
    ],
    // 开启source-map，webpack有多种source-map，在官网文档可以查到
    // 这个选项会使文件增大不少
    devtool: '#eval-source-map',
    cache: true,
}