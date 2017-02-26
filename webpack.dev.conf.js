var path = require('path');
var webpack = require("webpack");
var autoprefixer = require('autoprefixer');
var glob = require('glob');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var values = require('postcss-modules-values')
var entries = getEntry('./client/src/**/*.js'); // 获得入口 js 文件
var chunks = Object.keys(entries);
console.log('entries:', entries)
console.log('chunks:', chunks)


module.exports = {
    entry: entries,
    output: {
        // 文件地址
        path: path.join(__dirname, './public'),
        filename: "[name].js",
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
                include: path.join(__dirname, './client'),
            },
            // 转化ES6的语法
            {
                test: /\.js$/,
                loader: 'babel',
                include: path.join(__dirname, './client'),
            },
            // 编译css并自动添加css前缀
            {
                test: /\.css$/,
                // loader: 'style!css',
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use:'css-loader!postcss-loader'
                })
                // include: path.join(__dirname, './node_modules'),
            },
            // 自动编译 less 文件
            {
                test: /\.less$/,
                // loader: "style!css!postcss!less?sourceMap",
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use:'css-loader!postcss-loader!less-loader'
                }),
                include: path.join(__dirname, './client'),
            },
            // 图片转化，自动转化为base64的编码
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192',
                include: path.join(__dirname, './client'),
            },
            // 加载字体
            {
                test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?name=fonts/[name]_[hash].[ext]'
            },
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
            chunks: chunks.filter((item)=>item.indexOf('bg')!=0),  // chunks是需要提取的模块
            minChunks:2
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'bg.vendor',
            chunks: chunks.filter((item)=>item.indexOf('bg')==0),  // chunks是需要提取的模块
            minChunks:2
        }),
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ],
    devtool: '#eval-source-map',
    cache: true,
}

function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname;
    glob.sync(globPath).forEach(function (entry) {
        if(entry.indexOf("store")<0){
            basename = path.basename(entry, path.extname(entry));
            let tmp = entry.split('/').slice(3,-1);

            // console.log(tmp,basename,tmp.length);
            if(tmp[0]==='blog')
                tmp.shift();
            if(tmp.length){

                pathname = tmp.join("/") + '/' + basename;
            }else{
                pathname = basename;
            }
            entries[pathname] = [entry,'webpack-hot-middleware/client?reload=true'];
        }
    });
    return entries;
}
