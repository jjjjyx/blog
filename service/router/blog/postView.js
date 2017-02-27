let debug = require('debug')('app:routes:blog/index' + process.pid),
    path = require('path'),
    Router = require("express").Router,
    xss = require('xss'),
    marked = require("marked"),
    renderer = new marked.Renderer(),
    postDao = require("../../dao/post.dao").postDao;

let loadArticleInfo = function(req, res, next){
    console.log(req.params.guid)
    req.checkParams('guid','页码应为整数').isAlphanumeric().len(24);
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return next();
        }else{
            let guid = req.params.guid;
            postDao.getArticleInfoByGuid(guid,(err, data)=>{
                let articleInfo = data[0];
                articleInfo.post_date = new Date(articleInfo.post_date).format("yyyy-MM-dd hh:mm:ss")
                articleInfo.postTag = data[1];
                res.render("article",articleInfo)
            })
        }
    });
}
module.exports = function() {
    let router = new Router();
    router.route("/p/:guid").get(loadArticleInfo)

    router.unless = require("express-unless");
    return router;
}
