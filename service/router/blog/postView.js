let debug = require('debug')('app:routes:blog/index' + process.pid),
    path = require('path'),
    Router = require("express").Router,
    xss = require('xss'),
    marked = require("marked"),
    renderer = new marked.Renderer(),
    _ = require("lodash"),
    postDao = require("../../dao/post.dao").postDao;

let loadArticleInfo = function(req, res, next){
    req.checkParams('guid','链接不正确').isAlphanumeric().len(24);
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            return res.render("404");
        }else{
            let guid = req.params.guid;
            postDao.getArticleInfoByGuid(guid,(err, data)=>{
                let articleInfo = data[0];

                if(_.isEmpty(articleInfo)){
                    return res.render("404");
                }
                articleInfo.post_date = new Date(articleInfo.post_date).format("yyyy-MM-dd hh:mm:ss")
                articleInfo.postTag = data[1];
                articleInfo.guid = guid;
                if(articleInfo.post_password){
                    let pass = req.post_password;
                    if(!pass || articleInfo.post_password != pass){
                        delete articleInfo.post_content;
                        return res.render("inputPass",articleInfo);
                    }
                }

                articleInfo.tocm = articleInfo.post_content.indexOf("[TOCM]")>=0;
                return res.render("article",articleInfo)
            })
        }
    });
}
let commentCallback = function(req, res, next){
    req.checkBody('action', '').notEmpty();
    req.checkBody('signature', '').isBase64();
    console.log(action,'---ds');
}
module.exports = function() {
    let router = new Router();
    router.route("/p/:guid").get(loadArticleInfo).post(function(req, res, next){
        req.post_password = req.body.post_password;
        next();
    },loadArticleInfo)
    router.route("/commentCallback").post(commentCallback)
    router.unless = require("express-unless");
    return router;
}
