
var path         = require('path');
var webpack      = require("webpack");
var autoprefixer = require('autoprefixer');
// var values = require('postcss-modules-values')

module.exports = {
    entry: {
        "main": "./public/js/index",
    },
    output: {
        // 文件地址
        path: path.join(__dirname, './dist'),
        // [name]这里是webpack提供的根据路口文件自动生成的名字
        filename: "[name].js",
        // 公共文件生成的地址
        publicPath: '/dist/'
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
            // 图片转化，小于8K自动转化为base64的编码
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
            {test: require.resolve('jquery'), loader: 'expose?$'}
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
    ],
    // 开启source-map，webpack有多种source-map，在官网文档可以查到
    // 这个选项会使文件增大不少
    devtool: '#eval-source-map',
    cache: true,
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
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
