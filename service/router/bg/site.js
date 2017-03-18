const debug = require('debug')('app:routes:post' + process.pid),
    Router = require("express").Router,
    bcrypt = require("bcryptjs"),
    path = require('path'),
    utils = require('../../utils'),
    siteDao = require("../../dao/site.dao");

let updata = function(req, res,next){
    let map = {
        msg:'ok'
    };

    siteDao.update(req.body,(err,data)=>{
        if (err) {
            map.code = -1;
            map.msg = data || "发生未知错误，刷新后重试";
        } else {
            map.code = 0;
            map.msg="修改完成";
        }
        res.map = map;
        next();
    })
}
let get = function(req, res,next){
    let map = {
        msg:'ok'
    };
    siteDao.get((err, data)=>{
        if (err) {
            map.code = -1;
            map.msg = data || "发生未知错误，刷新后重试";
        } else {
            map.code = 0;
            let d = {};
            data.forEach((item)=>{
                d[item.key] = item.value
            })
            map.data = d;
        }
        res.map = map;
        next();
    });
}
module.exports = function() {
    let router = new Router();
    router.route("/updata").post(updata,function(req, res) {
        return res.status(200).json(res.map);
    })
    router.route("/").post(get,function(req, res) {
        return res.status(200).json(res.map);
    })
    router.unless = require("express-unless");
    return router;
}
