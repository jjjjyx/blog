const debug = require('debug')('app:main:' + process.pid)
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compression = require('compression') // 压缩
const unless = require('express-unless')
const expressValidator = require('express-validator')
const Result = require('./src/common/resultUtils')
const middlewareOptions = require('./src/common/middlewareOptions')
global.config = require('./src/config')

// global.NODE_ENV = process.env.NODE_ENV || 'production';

debug('Starting application')
const app = express()
const IS_DEV = app.get('env') === 'development'
global.IS_DEV = IS_DEV

// app.engine('.ejs', require('ejs').__express);
// app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, './src/views'))

debug('Attaching plugins')
app.use(bodyParser.json({limit: '50mb'})) // for parsing application/json
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})) // for parsing application/x-www-form-urlencoded
// 没有使用文件上传的操作
// app.use(multer()); // for parsing multipart/form-data
app.use(cookieParser())
app.use(compression())
app.use(expressValidator(middlewareOptions.validator))

app.use(favicon(path.join(__dirname, 'favicon.ico')))
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', config.allowOrigin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Max-Age', 1000)
    res.setHeader('Access-Control-Allow-Headers', 'Authorization') // ×
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('X-Powered-By', 'jjjjyx')
    res.setHeader('Server', 'jjjjyx')
    // res.setHeader("Content-Type", "application/json;charset=utf-8");
    next()
})

// 指定静态目录
// let compiler
if (IS_DEV) {
    let webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackDevConfig = require('./webpack/webpack.dev.conf')
    // static_dir = express.static(path.join(__dirname, 'static'))
    let compiler = webpack(webpackDevConfig)
    // attach to the compiler & the server
    app.use('/', webpackDevMiddleware(compiler, {
        // public path should be the same with webpack config
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {colors: true}
    }))
    app.use('/', webpackHotMiddleware(compiler))

}else {
    let static_dir = express.static(path.join(__dirname, './'))
    static_dir.unless = unless
    app.use(static_dir.unless({method: 'OPTIONS'}))
}

require('./src/routers')(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
// no stacktraces leaked to user unless in development environment
// api 的错误拦截器 返回值都是json
app.use('/api/', function (err, req, res, next) {
    res.status(err.status || 500)

    if (err.name === 'UnauthorizedError') {
        return res.json(Result.error('invalid token...'))
    } else {
        return res.json(Result.error())
    }
})

app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    if (err.name === 'UnauthorizedError') {
        return res.send('invalid token...')
    }
    // 如果是 /api/* 的路由的错误
    res.render('error', {
        message: err.message,
        error: IS_DEV ? err : {}
    })
})
module.exports = app
