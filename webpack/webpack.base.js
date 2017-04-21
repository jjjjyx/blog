const path = require('path')
const webpack = require('webpack')

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, '../'),
    output: {
        path: path.resolve(__dirname, '../public'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].[hash].js'
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias:{
            'client':path.join(__dirname, '../client'),
            'public':'client/public',
            'components':'client/components',
        }
    },

    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/
            },
            // 编译css并自动添加css前缀
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    // use: 'css-loader!postcss-loader'
                    use: ["css-loader","postcss-loader"]
                })
            },
            // 自动编译 less 文件
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    // use: 'css-loader!postcss-loader!less-loader'
                    use: ["css-loader","postcss-loader","less-loader"]
                }),
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
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
    ]
}
