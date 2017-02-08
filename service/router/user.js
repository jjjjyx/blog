let debug = require('debug')('app:routes:user' + process.pid),
    Router = require("express").Router,
    bcrypt = require("bcryptjs"),
    path = require('path'),
    utils = require('../utils'),
    rateLimiter = require('redis-rate-limiter'),
    redis = require("redis"),
    client = redis.createClient(),
    userDao = require("../dao/user.dao").userDao;


var authenticate = function (req, res, next) {
    // debug("Processing authenticate middleware");
    var username = req.body.username,
        password = req.body.password;
    // var limit = new Limiter({ id: username, db: client,max:10});
    // limit.get(function(err, limit) {
    //     console.log(err,limit);
    // });
    // console.log( req.connection.remoteAddress , req.route.path)
    req.checkBody('username','账号不符').notEmpty().len(3,20);
    req.checkBody('password','请输入一个正常的密码').notEmpty().len(3,20);
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(res.map);
        }else{

            process.nextTick(() =>{
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
                        }
                    }

                })
            });
        }
    });

};
function ipAndRoute(req) {
  return req.connection.remoteAddress + ':' + req.route.path;
}
module.exports = function () {

    var router = new Router();
    router.route("/auth").all(function (req, res, next) {
        let user = req.user;
        delete user.token;
        delete user.id;
        return res.status(200).json({
            code:0,
            data:user
        });
    });

    router.route("/logout").get(function (req, res, next) {
        if (utils.expire(req)) {
            res.clearCookie('u');
            delete req.user;
            return res.status(200).json({"msg": "User has been successfully logged out"});
        } else {
            return res.status(401).json({"msg": "UnauthorizedAccessError"});
        }
    });

    router.route("/login").post(rateLimiter.middleware({redis: client, key: ipAndRoute, rate: '5/minute'}),authenticate, function (req, res, next) {
        return res.status(200).json(res.map);
    });

    router.unless = require("express-unless");

    return router;
};
