let debug = require('debug')('app:routes:term' + process.pid),
    Router = require("express").Router,
    bcrypt = require("bcryptjs"),
    path = require('path'),
    utils = require('../utils');
    termDao = require("../dao/term.dao").termDao;

var getAllTerm = function (req, res, next){
    termDao.loadAll((err,list)=>{
        let map = {} ;
        if(err){
            map.code = -1;
            map.msg = "发生未知错误，刷新后重试";
        }else{
            console.log(list,2);
            map.code = 0;
            map.data = list;
            map.msg = "success";
        }
        res.map = map;
        next();
    })
}
var addTerm = function (req,res,next){
    var name = req.body.name;
    // if(name)
    if(!name||!(/^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/.test(name))){
        res.map = {
            code: -2,
            msg: "请提交正确的分类名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！",
        }
        return next();
    }else{
        termDao.add({name},(err,data)=>{
            let map = {} ;
            if(err){
                map.code = -1;
                map.msg = data || "发生未知错误，刷新后重试";
            }else{
                map.code = 0;
                map.data = data;
                map.msg = "新建成功";
            }
            res.map = map;
            next();
        });
    }

}

module.exports = function () {
    var router = new Router();
    router.route("/getAllTerm").post(getAllTerm,function (req, res, next) {
        // console.log(res.map)
        return res.status(200).json(res.map);
    });
    router.route("/addTerm").post(addTerm,function (req, res, next) {
        // console.log(res.map)
        return res.status(200).json(res.map);
    });

    router.unless = require("express-unless");
    return router;
}
