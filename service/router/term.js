let debug = require('debug')('app:routes:term' + process.pid),
    Router = require("express").Router,
    bcrypt = require("bcryptjs"),
    path = require('path'),
    utils = require('../utils');
    termDao = require("../dao/term.dao").termDao;
    // validator = require('node-validator');

// let nameReg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/;
let getAllTerm = function (req, res, next) {
    termDao.loadAll((err, list) => {
        let map = {};
        if (err) {
            map.code = -1;
            map.msg = "发生未知错误，刷新后重试";
        } else {
            map.code = 0;
            map.data = list;
            map.msg = "success";
        }
        res.map = map;
        next();
    })
}
let addTerm = function (req, res, next) {

    req.checkBody('name','请提交正确的分类名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！').notEmpty().isTermname();
    req.sanitizeBody('name');
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(res.map);
        }else{
            termDao.add({name:req.body.name}, (err, data) => {
                let map = {};
                if (err) {
                    map.code = -1;
                    map.msg = data || "发生未知错误，刷新后重试";
                } else {
                    map.code = 0;
                    map.data = data;
                    map.msg = "新建成功";
                }
                res.map = map;
                next();
            });
        }
    });
}
let editTerm = function (req, res, next) {

    req.checkBody('term_id','ID不正确').notEmpty().isInt();
    req.checkBody('name','请提交正确的分类名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！').notEmpty().isTermname();

    req.sanitizeBody('name');

    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(res.map);
        }else{
            let name = req.body.name,
                term_id = req.body.term_id;
            termDao.edit({term_id,name}, (err, data) => {
                let map = {};
                if (err) {
                    map.code = -1;
                    map.msg = data || "发生未知错误，刷新后重试";
                } else {
                    map.code = 0;
                    map.data = data;
                    map.msg = "修改成功";
                }
                res.map = map;
                next();
            });
        }
        // console.log(result.array());
    });
}

module.exports = function () {
    let router = new Router();

    router.route("/getAllTerm").post(getAllTerm, function (req, res, next) {
        // console.log(res.map)
        return res.status(200).json(res.map);
    });
    // let checkAdd = validator.isObject()
    //     .withRequired('name', validator.isString({
    //         regex: nameReg,
    //         message: '请提交正确的分类名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！'
    //     }));

    router.route("/addTerm").post(addTerm, function (req, res, next) {
        return res.status(200).json(res.map);
    });

    // let checkEdit = validator.isObject()
    //     .withRequired("term_id", validator.isInteger({min: 0}))
    //     .withRequired('name', validator.isString({
    //         regex: nameReg,
    //         message: '请提交正确的分类名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！'
    //     }));
    router.route("/editTerm").post(editTerm, function (req, res, next) {
        // console.log(res.map)
        return res.status(200).json(res.map);
    });


    router.unless = require("express-unless");
    return router;
}
