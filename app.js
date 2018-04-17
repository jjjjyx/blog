let debug = require('debug')('app:' + process.pid);
let express = require('express');
let path = require('path');
let ejs = require('ejs');
let bodyParser = require('body-parser');
let app = express();
let cookieParser = require('cookie-parser'),
    expressValidator = require('express-validator');
global.NODE_ENV = process.env.NODE_ENV || 'production'
let isDev = NODE_ENV !== 'production';

debug("Starting application");

global.C = require("./service/config");
let unless = require('express-unless');
let expressJwt = require('express-jwt');
let utils = require("./service/utils");

// app.engine('html', consolidate.ejs);

app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, './service/views'));


// app.use(express.favicon());
app.use(bodyParser());
app.use(expressValidator({
    customValidators:{
        isTermname(value){
            // console.log(value);
            return /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/.test(value)
        },
        isArray: function(value) {
            if(value)
                return Array.isArray(value);
            else return true;
        },
    }
}));
app.use(cookieParser());
app.use(require('compression')());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', C.allowOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Max-Age', 1000);
    res.setHeader('Access-Control-Allow-Headers', '*'); //X-Requested-With,content-type,Authorization,Set-Cookie
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("X-Powered-By", 'jjjjyx');
    res.setHeader("Server", 'jjjjyx');
    // res.setHeader("Content-Type", "application/json;charset=utf-8");
    next();
});

// We are going to protect /api routes with JWT
var jwtCheck = expressJwt({
    secret: global.C.secret,
    getToken: function (req) {
        return req.cookies.u
    }
});
jwtCheck.unless = unless;


app.use("/api",jwtCheck.unless({
    path: ['/api/user/login'],
    method: 'OPTIONS'
}));
app.use("/api",utils.middleware().unless({
    path: ['/api/user/login'],
    method: 'OPTIONS'
}));
require('./service/router/base')(app);
require('./service/router/index')(app);

if (isDev) {
    var webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackDevConfig = require('./webpack/webpack.config.js');
        // webpackDevConfig = require('./webpack.dev.conf.js')

    var compiler = webpack(webpackDevConfig);
    // attach to the compiler & the server
    app.use("/static",webpackDevMiddleware(compiler, {
        // public path should be the same with webpack config
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
    app.use("/static",webpackHotMiddleware(compiler));
}
app.use("/static",express.static(path.join(__dirname, 'public')));
app.use("/favicon.ico",express.static(path.join(__dirname, 'public/favicon.ico')));
// /*404*/
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    res.render('404');
})
/*错误处理器*/
app.use(function (err, req, res, next) {
    
    if (err.name === 'UnauthorizedError') {
        return res.status(200).send({code:401,msg:'invalid token...'});
    }

    return res.status(500).json({
        code: 500,
        msg: err.message
    });
});
let server = app.listen(C.APP_PORT, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log(`Example app (${isDev?'dev':'production'}) listening at http://${host}:${port}`);
});
