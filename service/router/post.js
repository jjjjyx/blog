let debug = require('debug')('app:routes:post' + process.pid),
    Router = require("express").Router,
    bcrypt = require("bcryptjs"),
    path = require('path'),
    utils = require('../utils');
    postDao = require("../dao/post.dao").postDao;

let newpost = function(req, res, next){
    req.checkBody('post_title','请输入一个有效的标题，有效的标题长度在1~255').notEmpty().len(1,255);
    req.checkBody('term_id','未提交所属分类').notEmpty().isInt();
    req.sanitizeBody('post_title');
    req.sanitizeBody('term_id');
    let term_id = req.body.term_id;
    let post_title = req.body.post_title;
    console.log(req.user,term_id,post_title);

    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(map);
        }else{
            // termDao.add({name:req.body.name,taxonomy:'category',description:'分类'}, (err, data) => {
            //     let map = {};
            //     if (err) {
            //         map.code = -1;
            //         map.msg = data || "发生未知错误，刷新后重试";
            //     } else {
            //         map.code = 0;
            //         map.data = data;
            //         map.msg = "新建成功";
            //     }
            //     res.map = map;
            //     next();
            // });
        }
    });
    // postDao.save({post_title,term_id},()=>{
    //
    // })
}

module.exports = function () {
    let router = new Router();

    router.route("/newpost").post(newpost, function (req, res, next) {
        return res.status(200).json(res.map);
    });


    router.unless = require("express-unless");
    return router;
}
