let debug = require('debug')('app:routes:user' + process.pid),
    Router = require("express").Router,
    bcrypt = require("bcryptjs"),
    path = require('path'),
    utils = require('../../utils'),
    rateLimiter = require('redis-rate-limiter'),
    redis = require("redis"),
    client = redis.createClient(),
    userDao = require("../../dao/user.dao");


let authenticate = function (req, res, next) {
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
            return res.status(400).json(map);
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
let updata = function (req, res, next) {
    req.checkBody('user_nickname','请输入一个正常的昵称').notEmpty().len(1,8);
    req.checkBody('display_name','请输入正确的名称').len(0,6)
    req.checkBody('user_email','邮箱地址不正确').notEmpty().isEmail();
    req.getValidationResult().then(function(result) {
        let map = {};
        if(!result.isEmpty()){
            map.code = 1;
            map.msg = result.array()[0].msg
            res.map = map;
            return next()
        }else{
            if(req.body.user_pass){
                req.body.user_pass = "";
                delete req.body.user_pass;
            }
            userDao.updata(req.user,req.body,(err,data)=>{
                if (err) {
                    map.code = -1;
                    map.msg = data || "发生未知错误，刷新后重试";
                } else {
                    utils.create(data, req, res, next);
                }

            })
        }
    });
}
const passReg = new RegExp("^(?![a-zA-z]+$)(?!\\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\\d!@#$%^&*]+$)[a-zA-Z\\d!@#$%^&*]+$")
let updataPass = function (req, res, next) {
    req.checkBody('new_pass','密码必须为6-18位 必须包含特殊字符和中英文').notEmpty().len(6,18).matches(passReg);
    req.getValidationResult().then(function(result) {
        let map = {};
        if(!result.isEmpty()){
            map.code = 1;
            map.msg = result.array()[0].msg;
            res.map = map;
            return next()
        }else{
            let new_pass = req.body.new_pass;
            let cpass = req.body.cpass;
            if(new_pass == cpass){
                let user_pass = bcrypt.hashSync(new_pass);
                userDao.updata(req.user,{user_pass},(err,data)=>{
                    if (err) {
                        map.code = -1;
                        map.msg = data || "发生未知错误，刷新后重试";
                    } else {
                        // 修改密码退出登录
                        res.clearCookie('u');
                        delete req.user;
                        map.code = 0;
                        map.msg = "修改成功，请重新登录";
                        res.map = map;
                        next()
                    }
                })
            }else{
                map.code = 2;
                map.msg = "2次密码不一致";
                res.map = map;
                return next()
            }

        }
    });

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
    router.route("/updataInfo").post(updata,function(req,res,next){
        return res.status(200).json(res.map);
    })
    router.route("/updataPass").post(updataPass,function(req,res,next){
        return res.status(200).json(res.map);
    })
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
