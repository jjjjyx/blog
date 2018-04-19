'use strict';


const debug = require("debug")("app:routers")
const expressJwt = require('express-jwt');
const unless = require('express-unless');
// const _ = require("lodash");


// const paths = [
//     '/',
//     '/p',
//     '/comment',
//     '/category',
//     '/archives',
//     '/author',
//     '/bg/admin'
// ]
const unless_path = {
    path: ['/api/user/login'],
    method: 'OPTIONS'
}
const jwtCheck = expressJwt({
    secret: config.secret,
    getToken:function fromHeaderOrQuerystring (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        // } else if (req.query && req.query.token) {
        //     return req.query.token;
        }
        return null;
    }
});
jwtCheck.unless = unless;


module.exports = function (app) {
    // 指定权限验证路径
    // /api 下全是需要登录才可以访问
    app.use("/api",jwtCheck.unless(unless_path))
    // app.use("/api",middleware.unless(unless_path))


    app.use("/api/user", require("./user.js"));

}