const debug = require('debug')('app:main:' + process.pid);
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression'); // 压缩
const unless = require('express-unless');
const expressValidator = require('express-validator');
global.config = require("./src/config");

// global.NODE_ENV = process.env.NODE_ENV || 'production';

debug("Starting application");
const app = express();
const IS_DEV = app.get('env') === 'development';
global.IS_DEV = IS_DEV;

// app.engine('.html', ejs.__express);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, './src/views'));


debug("Attaching plugins");
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json
// 好像没有使用文件上传的操作
// app.use(multer()); // for parsing multipart/form-data
app.use(cookieParser());
app.use(compression());
app.use(expressValidator())



app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', config.allowOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Max-Age', 1000);
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,Set-Cookie'); // ×
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("X-Powered-By", 'jjjjyx');
    res.setHeader("Server", 'jjjjyx');
    // res.setHeader("Content-Type", "application/json;charset=utf-8");
    next();
});


// 指定静态目录
let static_dir = express.static(path.join(__dirname, 'static'));
static_dir.unless = unless;
app.use(static_dir.unless({ method: 'OPTIONS' }));


require('./src/routers')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
    res.status(err.status || 500);

    if (err.name === 'UnauthorizedError') {
        return res.send('invalid token...');
    }

    res.render('error', {
        message: err.message,
        error: IS_DEV ? err : {}
    });
});
module.exports = app;
