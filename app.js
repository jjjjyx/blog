let debug = require('debug')('app:' + process.pid);
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let app = express();
let cookieParser = require('cookie-parser'),
    expressValidator = require('express-validator');



debug("Starting application");

let unless = require('express-unless');
let expressJwt = require('express-jwt');
let config = require("./service/config");
let utils = require("./service/utils");
global.C = config;

app.use(bodyParser());
app.use(expressValidator({
    customValidators:{
        isTermname(value){
            // console.log(value);
            return /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/.test(value)
        }
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
    res.setHeader("X-Powered-By", 'test');
    // res.setHeader("Server", 'jjjjyx');
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    next();
});

// app.use('/', express.static(path.join(__dirname, 'client/home')));
// We are going to protect /api routes with JWT
var jwtCheck = expressJwt({
    secret: global.C.secret,
    getToken: function (req) {
        return req.cookies.u
    }
});
jwtCheck.unless = unless;
// app.use(function(req,res,next){
//     // res.cookie("test", {account: 'userName', hash: 'hash', last: 'lastTime'}, {maxAge: 60000*60*24*5,httpOnly:true});
//     next()
// });
app.use(jwtCheck.unless({
    path: ['/api/user/login'],
    method: 'OPTIONS'
}));
app.use(utils.middleware().unless({
    path: ['/api/user/login'],
    method: 'OPTIONS'
}));
app.use("/api", require(path.join(__dirname, "service/router", "term.js"))());
app.use("/api/user", require(path.join(__dirname, "service/router", "user.js"))());


/*错误处理器*/
app.use(function (err, req, res, next) {
    console.log(err.message);
    if (err.name === 'UnauthorizedError') {
        return res.status(200).send({code:401,msg:'invalid token...'});
    }
    return res.status(500).json({
        code: 500,
        msg: err.message
    });
});
// // /*404*/
// app.use(function (req, res, next) {
//     let err = new Error('Not Found');
//     err.status = 404;
//     res.render('admin-404');
//     // next(err);
// })

let server = app.listen(C.APP_PORT, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
