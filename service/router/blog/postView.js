const debug = require('debug')('app:routes:blog/index' + process.pid),
    path = require('path'),
    Router = require("express").Router,
    utils = require('../../utils'),
    marked = require("marked"),
    renderer = new marked.Renderer(),
    _ = require("lodash"),
    readsDao = require("../../dao/read.dao"),
    postDao = require("../../dao/post.dao"),
    imgList = require("./avatar.json");


let loadArticleInfo = [
    function(req, res, next){
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
                    articleInfo.post_date = new Date(articleInfo.post_date).format("yyyy-MM-dd HH:mm:ss")
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
                    articleInfo.cookies = req.cookies
                    return res.render("article",articleInfo)
                })
            }
        });
    },
]
let read =async  function(req, res, next){
    res.set({
        'ETag': +new Date()
    })
    req.checkParams('guid','链接不正确').isAlphanumeric().len(24);
    let result = await req.getValidationResult();
    if(!result.isEmpty()){
        let map = { code: 1, msg: result.array()[0].msg };
        return res.status(400).json(map);
    }else{
        let guid = req.params.guid;
        res.map = {code:0};
        postDao.getArticleInfoByGuid(guid,(err, data)=>{
              let articleInfo = data[0];
              if(_.isEmpty(articleInfo)){
                  res.map.code = -2;
                  return next();
              }
              let ip = utils.getClientIp(req);
              let useragent = req.headers['user-agent'];
              readsDao.add({ip,useragent,guid},(err)=>{
                  if(err){
                      res.map.code = -3;
                      // 已经阅读或者数据库错误
                  }else{
                      res.map.code = 0;
                  }
                  next()
              })
         })
    }
};

let heart = async function(req, res, next){
    req.checkBody('guid', '喜欢的文章呢？！').isAlphanumeric().len(24);
    let result = await req.getValidationResult()
    if(!result.isEmpty()){
        let map = { code: 1, msg: result.array()[0].msg };
        return res.status(400).json(map);
    }else{
        const guid = req.body.guid;
        const maxAge = 365*5*60000*60*24,
              httpOnly = true;
        if(req.cookies[`heart_${guid}`]){
            res.map = {
                code:-1,
                msg:'刷赞可耻~拒绝刷赞'
            }
        }else{
            res.cookie(`heart_${guid}`, guid, {maxAge , httpOnly });
            postDao.updateHeart(guid);
            res.map = {
                code:0,
                msg:'success'
            }
        }
        next()
    }
}





module.exports = function() {
    let router = new Router();
    router.route("/read/:guid").get(read,function (req, res, next) {
        return res.status(200).json(res.map);
    });

    router.route("/heart").post(heart, function (req, res, next) {
        return res.status(200).json(res.map);
    })

    router.route("/:guid").get(loadArticleInfo).post(function(req, res, next){
        req.post_password = req.body.post_password;
        next();
    },loadArticleInfo);

    router.unless = require("express-unless");
    return router;
}
