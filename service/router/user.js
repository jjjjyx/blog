let debug = require('debug')('app:routes:user' + process.pid),
    Router = require("express").Router,
    bcrypt = require("bcryptjs"),
    path = require('path'),
    utils = require('../utils');
    userDao = require("../dao/user.dao").userDao;

var authenticate = function (req, res, next) {

    // debug("Processing authenticate middleware");

    var username = req.body.username,
        password = req.body.password;

    if (!username || !password ) {
        res.map = {
            code: -1,
            msg: "请输入账号密码",
        }
        return next();
        // return res.status(401).json({code:-1,msg:"请输入账号"});
    }
    process.nextTick(() =>{
        // console.log(username,password)
        userDao.getUserByLoginName(username,(err,user)=>{
            if (err || !user) {
                res.map = {
                    code: 1,
                    msg: "账号不存在",
                }
                next();
            }else{
                let isMatch = bcrypt.compareSync(password, user.user_pass);
                if(isMatch){
                    debug("User authenticated, generating token");
                    utils.create(user, req, res, next);
                }else{
                    res.map = {
                        code: 2,
                        msg: "密码错误"
                    }
                    next();
                    // return res.status(200).json({code:2,msg:"密码错误"});
                }
            }
        })
    });
};
module.exports = function () {

    var router = new Router();

    router.route("/verify").get(function (req, res, next) {
        return res.status(200).json(undefined);
    });

    router.route("/logout").get(function (req, res, next) {
        if (utils.expire(req.headers)) {
            delete req.user;
            return res.status(200).json({"msg": "User has been successfully logged out"});
        } else {
            return res.status(401).json({"msg": "UnauthorizedAccessError"});
        }
    });

    router.route("/login").post(authenticate, function (req, res, next) {
        return res.status(200).json(res.map);
    });

    router.unless = require("express-unless");

    return router;
};
