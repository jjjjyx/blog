var path = require('path');
var webpack = require("webpack");
var autoprefixer = require('autoprefixer');
var glob = require('glob');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
    // var values = require('postcss-modules-values')

module.exports = {
    entry: getEntry('./public/js/*.js'),
    output: {
        // 文件地址
        path: path.join(__dirname, './dist'),
        // [name]这里是webpack提供的根据路口文件自动生成的名字
        filename: "static/js/[name].js",
        // 公共文件生成的地址
        // publicPath: ''
    },
    module: {
        // 加载器
        loaders: [
            // 解析.vue文件
            {
                test: /\.vue$/,
                loader: 'vue',
                include: path.join(__dirname, './view'),
            },
            // 转化ES6的语法
            {
                test: /\.js$/,
                loader: 'babel',
                include: path.join(__dirname, './public'),
            },
            // 编译css并自动添加css前缀
            {
                test: /\.css$/,
                loader: 'style!css!postcss-loader',
                // include: path.join(__dirname, './src/css'),
            },
            // 自动编译 less 文件
            {
                test: /\.less$/,
                loader: "style!css!postcss!less?sourceMap",
                include: path.join(__dirname, './public/css'),
            },
            // 图片转化，自动转化为base64的编码
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192',
                include: path.join(__dirname, './public/img'),
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
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['', '.js', '.vue'],
        // 别名，可以直接使用别名来代表设定的路径以及其他
        alias: {
            jquery: 'jquery/dist/jquery.js'
        },
        // modulesDirectories: ["node_modules"],
    },
    plugins: [
        // new webpack.DllReferencePlugin({
        //     context: path.join(__dirname, "src"),
        //     manifest: require("./dist/vendors-manifest.json")
        // }),
        new webpack.ProvidePlugin({
            $: "jquery",
            'jQuery': "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                // any required modules inside node_modules are extracted to vendor
                return module.resource && /\.(js|css)$/.test(module.resource) && module.resource.indexOf( path.join(__dirname, '../node_modules')) === 0

            }
        })
        //new ExtractTextPlugin("static/css/[name].css'")
    ],
    // 开启source-map，webpack有多种source-map，在官网文档可以查到
    // 这个选项会使文件增大不少
    devtool: '#eval-source-map',
    cache: true,
}

var entries = getEntry('./public/js/*.js');

Object.keys(entries).forEach(function (name) {
    // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
    module.exports.entry[name] = entries[name];

    // 每个页面生成一个html
    var plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: name + '.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: './view/' + name + '.html',
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: [name, 'vendor']
    });
    module.exports.plugins.push(plugin);
})

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: 'production'
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ])
}


function getEntry(globPath) {
    var entries = {},
        basename; //, tmp, pathname;

    glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        // tmp = entry.split('/').splice(-3);
        // pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
        entries[basename] = entry;
    });
    return entries;
}
