var path = require('path');
var webpack = require("webpack");
var autoprefixer = require('autoprefixer');
var glob = require('glob');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var values = require('postcss-modules-values')
var entries = getEntry('./client/src/**/*.js'); // 获得入口 js 文件
var chunks = Object.keys(entries);
console.log('entries:',entries)
console.log('chunks:',chunks)
// var extractLESS = new ExtractTextPlugin('static/css/[name].less');
module.exports = {
    entry: entries,
    output: {
        // 文件地址
        path: path.join(__dirname, './client/home'),
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
                include: path.join(__dirname, './client'),
            },
            // 转化ES6的语法
            {
                test: /\.js$/,
                loader: 'babel',
                include: path.join(__dirname, './client'),
            },
            // 编译css并自动添加css前缀
            // {
            //     test: /\.css$/,
            //     loader: 'style!css!postcss-loader',
            //     include: path.join(__dirname, './client/public/view'),
            // },
            // 编译css并自动添加css前缀
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
    },
    plugins: [
        // new webpack.DllReferencePlugin({
        //     context: path.join(__dirname, "src"),
        //     manifest: require("./dist/vendors-manifest.json")
        // }),
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     'jQuery': "jquery",
        //     "window.jQuery": "jquery"
        // }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            chunks: chunks,  // chunks是需要提取的模块
            minChunks:2
            // minChunks: function (module, count) {
            //     // any required modules inside node_modules are extracted to vendor
            //     // console.log("module.resource",module.resource);
            //     return module.resource && /\.(js|css)$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, './node_modules')) === 0
            // }
        }),
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        }),
        // new HtmlWebpackPlugin({
        //     // 生成出来的html文件名
        //     filename: 'index.html',
        //     // 每个html的模版，这里多个页面使用同一个模版
        //     template: './client/view/index.html',
        //     // 自动将引用插入html
        //     inject: true,
        //     // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        //     chunks: ['main', 'vendor']
        // })
    ],
    // 开启source-map，webpack有多种source-map，在官网文档可以查到
    // 这个选项会使文件增大不少
    devtool: '#eval-source-map',
    cache: true,
}
// var prod = process.env.NODE_ENV === 'production';

var pages = getEntry('./client/src/**/*.html');
console.log("pages:",pages)
for (var pathname in pages) {
  // 配置生成的 html 文件，定义路径等
  var conf = {
    filename: pathname + '.html',
    template: pages[pathname], // 模板路径
    inject: true,              // js 插入位置
    minify: {
      removeComments: true,
      collapseWhitespace: false
    }
  };
  if (pathname in module.exports.entry) {
    conf.chunks = ['vendor', pathname];
    conf.hash = false;
  }
  // 需要生成几个 html 文件，就配置几个 HtmlWebpackPlugin 对象
  module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}
// console.log(JSON.stringify(module.exports))
// 根据项目具体需求，具体可以看上面的项目目录，输出正确的 js 和 html 路径
// 针对不同的需求可以做修改
function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname;

    glob.sync(globPath).forEach(function (entry) {
        if(entry.indexOf("store")<0){
            basename = path.basename(entry, path.extname(entry));
            let tmp = entry.split('/');
            if(tmp.length==4){
                pathname = basename; // 正确输出 js 和 html 的路径
            }else{
                pathname = tmp.splice(-2).splice(0, 1) + '/' + basename; // 正确输出 js 和 html 的路径
            }
            entries[pathname] = entry;
        }
    });
    // console.log(entries)
    return entries;
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#cheap-module-source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
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
