let debug = require('debug')('app:routes:post' + process.pid),
    Router = require("express").Router,
    bcrypt = require("bcryptjs"),
    path = require('path'),
    utils = require('../../utils'),
    postDao = require("../../dao/post.dao").postDao,
    objectid = require("objectid-js");

let newpost = function(req, res, next){
    req.checkBody('post_title','请输入一个有效的标题，有效的标题长度在1~255').notEmpty().len(1,255);
    req.checkBody('term_id','未提交所属分类').notEmpty().isInt();
    // req.checkBody('seq_in_nb','未提交所属分类').notEmpty().isInt();

    req.sanitizeBody('post_title').trim();
    req.sanitizeBody('term_id');
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(map);
        }else{
            let term_id = req.body.term_id;
            let post_title = req.body.post_title;
            let seq_in_nb = req.body.seq_in_nb * 1;
            postDao.save({post_author:req.user.id,post_title,term_id,seq_in_nb,author:req.user.user_login},(err, data)=>{
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
            })
        }
    });
}
let posts = function(req, res, next){
    postDao.getPosts((err, data)=>{
        let map = {};
        if (err) {
            map.code = -1;
            map.msg = data || "发生未知错误，刷新后重试";
        } else {
            map.code = 0;
            map.data = data;
            map.msg = "success";
        }
        res.map = map;
        next();
    });
}
let postsTrash = function(req, res, next){
    postDao.getTrashPost((err, data)=>{
        let map = {};
        if (err) {
            map.code = -1;
            map.msg = data || "发生未知错误，刷新后重试";
        } else {
            map.code = 0;
            map.data = data;
            map.msg = "success";
        }
        res.map = map;
        next();
    });
}
let del = function(req, res, next){
    req.checkBody('id','请提交正确的id').notEmpty().isInt();
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(map);
        }else{
            postDao.del(req.body.id,(err, data)=>{
                let map = {};
                if (err) {
                    map.code = -1;
                    map.msg = data || "发生未知错误，刷新后重试";
                } else {
                    map.code = 0;
                    map.msg = "删除成功";
                }
                res.map = map;
                next();
            })
        }
    });
}
let move = function(req, res, next){
    req.checkBody('id','请提交正确的id').notEmpty().isInt();
    req.checkBody('targat','请提交正确的id').notEmpty().isInt();
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(map);
        }else{
            postDao.move(req.body.id,req.body.targat,(err, data)=>{
                let map = {};
                if (err) {
                    map.code = -1;
                    map.msg = data || "发生未知错误，刷新后重试";
                } else {
                    map.code = 0;
                    map.msg = "删除成功";
                }
                res.map = map;
                next();
            })
        }
    });
}
let content = function(req, res, next){
    req.checkBody('id','请提交正确的id').notEmpty().isInt();
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(map);
        }else{
            postDao.getPostInfoById(req.body.id,(err, data)=>{
                let map = {};
                if (err) {
                    map.code = -1;
                    map.msg = data || "发生未知错误，刷新后重试";
                } else {
                    // map.code = 0;
                    // map.data = data;
                    // map.msg = "删除成功";
                    map = data;
                }
                res.map = map;
                next();
            })
        }
    });
}
let save = function(req, res, next){
    req.checkBody('id','请提交正确的id').notEmpty().isInt();
    // console.log(req.body);
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(map);
        }else{
            postDao.update(req.body.id,req.body,(err, data)=>{
                let map = {};
                if (err) {
                    map.code = -1;
                    map.msg = data || "发生未知错误，刷新后重试";
                } else {
                    map.code = 0;
                    map.data = data;
                    map.msg = "保存成功";
                }
                res.map = map;
                next();
            })
        }
    });
}
let saveTag = function(req, res, next){
    req.checkBody('id','请提交正确的id').notEmpty().isInt();
    req.checkBody('tagList','请提交正确的分类').isArray();
    console.log(req.body.tagList);
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(map);
        }else{
            postDao.savePostTag(req.body.id,req.body.tagList,(err, data)=>{
                let map = {};
                if (err) {
                    map.code = -1;
                    map.msg = data || "发生未知错误，刷新后重试";
                } else {
                    map.code = 0;
                    map.data = data;
                    map.msg = "保存成功";
                }
                res.map = map;
                next();
            })
        }
    });
}
let postUnlock = function(req, res, next){
    req.checkBody('id','请提交正确的id').notEmpty().isInt();
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(map);
        }else{
            // 生成一个固定链接
            postDao.postUnlock(req.body.id, (err, data)=>{
                let map = {};
                if (err) {
                    map.code = -1;
                    map.msg = data || "发生未知错误，刷新后重试";
                } else {
                    map.code = 0;
                    map.data = data;
                    map.msg = "取消密码成功";
                }
                res.map = map;
                next();
            })
        }
    });
}
let publish = function(req, res, next){
    req.checkBody('id','请提交正确的id').notEmpty().isInt();
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(map);
        }else{
            // 生成一个固定链接
            let guid = (new objectid()).toString();
            postDao.postPublish(req.body.id, guid, (err, data)=>{
                let map = {};
                if (err) {
                    map.code = -1;
                    map.msg = data || "发生未知错误，刷新后重试";
                } else {
                    map.code = 0;
                    map.data = data;
                    map.msg = "成功发布";
                }
                res.map = map;
                next();
            })
        }
    });
}
let postUnPublish = function(req, res, next){
    req.checkBody('id','请提交正确的id').notEmpty().isInt();
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(map);
        }else{
            postDao.postUnPublish(req.body.id, (err, data)=>{
                let map = {};
                if (err) {
                    map.code = -1;
                    map.msg = data || "发生未知错误，刷新后重试";
                } else {
                    map.code = 0;
                    map.data = data;
                    map.msg = "取消发布成功";
                }
                res.map = map;
                next();
            })
        }
    });
}
module.exports = function () {
    let router = new Router();
    router.route("/posts").post(posts, function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/posts/trash").post(postsTrash, function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/newpost").post(newpost, function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/delPost").post(del, function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/movePost").post(move, function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/content").post(content, function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/save").post(save, function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/saveTag").post(saveTag, function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/publish").post(publish, function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/postUnPublish").post(postUnPublish, function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/postUnlock").post(postUnlock, function (req, res, next) {
        console.log(res.map)
        return res.status(200).json(res.map);
    });


    router.unless = require("express-unless");
    return router;
}
