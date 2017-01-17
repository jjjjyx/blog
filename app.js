let debug = require('debug')('app:' + process.pid);
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let app = express();

debug("Starting application");

let unless = require('express-unless');
let expressJwt = require('express-jwt');
let config = require("./service/config");
let utils = require("./service/utils");
global.C = config;

app.use(bodyParser());
app.use(require('compression')());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3879');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    // res.setHeader("X-Powered-By", 'jyx@rpgame.net');
    // res.setHeader("Server", 'jjjjyx');
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use('/', express.static(path.join(__dirname, 'client/home')));
// We are going to protect /api routes with JWT
var jwtCheck = expressJwt({
    secret: global.C.secret
});
jwtCheck.unless = unless;
app.use(jwtCheck.unless({
    path: ['/api/user/login'],
    method: 'OPTIONS'
}));
app.use(utils.middleware().unless({
    path: ['/api/user/login'],
    method: 'OPTIONS'
}));
app.use("/api/user", require(path.join(__dirname, "service/router", "user.js"))());

/*错误处理器*/
app.use(function (err, req, res, next) {
    console.log(err.message);
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
