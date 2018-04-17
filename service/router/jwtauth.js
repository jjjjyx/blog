const debug = require('debug')('app:jwt:' + process.pid),
    path = require('path'),
    util = require('util'),
    crypto = require('crypto'),
    redis = require("redis"),
    client = redis.createClient(),
    _ = require("lodash"),
    config = require("../config.js"),
    request = require('request-json'),
    jsonwebtoken = require("jsonwebtoken"),
    uuid = require("node-uuid"),
    TOKEN_EXPIRATION = 60, // 单位秒
    TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60*24*5; //
module.exports.jwtauth = function () {
    let func = function (req, res, next) {
        let token = req.cookies.u;
        jsonwebtoken.verify(token,C.secret,(err,p)=>{
            console.log(err,p)
        })
        next()
        // console.log("u",token);
    };

    func.unless = require("express-unless");

    return func;
};
