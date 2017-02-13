let debug = require('debug')('app:routes:term' + process.pid),
    Router = require("express").Router,
    bcrypt = require("bcryptjs"),
    path = require('path'),
    utils = require('../../utils');
    termDao = require("../../dao/term.dao").termDao;
    // validator = require('node-validator');

// let nameReg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/;
let getAllTerm = function (req, res, next) {
    // req.checkBody('name','0').notEmpty().isTermname();
    // let taxonomy = "category";
    // switch (req.body.taxonomy) {
    //     case '1':
    //         taxonomy = 'tag';
    //         break;
    //     default:
    // }
    // console.log(taxonomy,req.body.taxonomy)
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
    req.sanitizeBody('name').escape();
    // console.log(req.body.name);
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(map);
        }else{
            termDao.add({name:req.body.name,taxonomy:'category',description:'分类'}, (err, data) => {
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
let addTag = function (req, res, next) {
    req.checkBody('name','请提交正确的标签名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！').notEmpty().isTermname();
    req.sanitizeBody('name');
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(map);
        }else{
            termDao.add({name:req.body.name,taxonomy:'tag',description:'标签'}, (err, data) => {
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
            return res.status(400).json(map);
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

let deleteTerm = function (req, res, next) {
    req.checkBody('term_id','ID不正确').notEmpty().isInt();
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(res.map);
        }else{
            termDao.delete(req.body.term_id, (err, data) => {
                let map = {};
                if (err) {
                    map.code = -1;
                    map.msg = data || "发生未知错误，刷新后重试";
                } else {
                    map.code = 0;
                    map.data = data;
                    map.msg = "删除成功";
                }
                res.map = map;
                next();
            });
        }
        // console.log(result.array());
    });
}
let deleteTag = function (req, res, next) {
    req.checkBody('term_id','ID不正确').notEmpty().isInt();
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(res.map);
        }else{
            termDao.deleteTag(req.body.term_id, (err, data) => {
                let map = {};
                if (err) {
                    map.code = -1;
                    map.msg = data || "发生未知错误，刷新后重试";
                } else {
                    map.code = 0;
                    map.data = data;
                    map.msg = "删除成功";
                }
                res.map = map;
                next();
            });
        }
    });
}
module.exports = function () {
    let router = new Router();

    router.route("/getAllTerm").post(getAllTerm, function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/addTerm").post(addTerm, function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/addTag").post(addTag, function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/editTerm").post(editTerm, function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/deleteTerm").post(deleteTerm, function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/deleteTag").post(deleteTag, function (req, res, next) {
        return res.status(200).json(res.map);
    });



    router.unless = require("express-unless");
    return router;
}