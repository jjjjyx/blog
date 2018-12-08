// const debug = require('debug')('app:main:' + process.pid)
const log4js = require('log4js')
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compression = require('compression') // 压缩
const unless = require('express-unless')
const log = log4js.getLogger('app')
const opLog = log4js.getLogger('op.app')
const accessLog = log4js.getLogger('http.app')

const UnauthorizedError = require('./src/errors/UnauthorizedError')
const Result = require('./src/common/result')

log.debug('Starting application')
const app = express()
const IS_DEV = app.get('env') === 'development'
log.trace('env = %s', app.get('env'))
global.config = require('./config')
global.IS_DEV = IS_DEV

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, './src/views'))
// app.set('trust proxy', 1) // 信任第一代理

log.debug('Attaching plugins')
app.use(bodyParser.json({limit: '50mb'})) // for parsing application/json
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})) // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data  // 没有使用文件上传的操作
app.use(cookieParser())
app.use(compression()) // gzip 压缩
app.use(require('./src/express-middleware/clientIp'))
app.use(require('./src/express-middleware/validator'))
app.use(require('./src/express-middleware/logger'))
app.use(favicon(path.join(__dirname, 'favicon.ico')))

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', config.allowOrigin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Max-Age', 1000)
    res.setHeader('Access-Control-Allow-Headers', config.tokenHeaderKey) // ×
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('X-Powered-By', 'jjjjyx')
    res.setHeader('Server', 'jjjjyx')
    // res.setHeader("Content-Type", "application/json;charset=utf-8");
    next()
})

// 指定静态目录
if (IS_DEV) {
    let webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware')
    // webpackDevConfig = require('./webpack/webpack.dev.conf')
    const webpackDevConfig = require('@vue/cli-service/webpack.config')
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

} else {
    let static_dir = express.static(path.join(__dirname, './dist'), {
        maxAge: '30d'
    })
    static_dir.unless = unless
    app.use(static_dir.unless({method: 'OPTIONS'}))
}

require('./src/routers')(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found')
    err.status = 404
    res.render('404')
})

// error handler
// no stacktraces leaked to user unless in development environment
// api 的错误拦截器 返回值都是json
app.use('/api/', function (err, req, res, next) {
    res.status(err.status || 500)
    if (err instanceof UnauthorizedError) {
        log.info(`Access to ${req.originalUrl} failed, user authentication failed `)
        return res.json(Result.error('invalid token...'))
    } else {
        log.error('Api internal error by:', err)
        return res.json(Result.error(IS_DEV ? err : {}))
    }
})

app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    if (err instanceof UnauthorizedError) {
        // 访问失败
        accessLog.info(`Visit ${req.originalUrl} ${err.message}`)
        return res.send('invalid token...')
    }
    // 如果是的路由的错误
    log.error('Access to %s failed with internal server error:', req.originalUrl,err)
    accessLog.info(`Access to ${req.originalUrl} failed with internal error by：`, err)
    res.render('error', {message: err.message, error: IS_DEV ? err : {}})
})
module.exports = app
