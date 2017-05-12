const debug = require('debug')('app:routes:blog/index' + process.pid),
    path = require('path'),
    Router = require("express").Router,
    xss = require('xss'),
    utils = require('../../utils'),
    marked = require("marked"),
    renderer = new marked.Renderer(),
    _ = require("lodash"),
    jsonwebtoken = require("jsonwebtoken"),
    readsDao = require("../../dao/read.dao"),
    postDao = require("../../dao/post.dao"),
    commentDao = require("../../dao/comment.dao"),
    moment = require("moment"),
    useragent = require('useragent');


let loadArticleInfo = [
    // function(req, res, next){
    //
    // },
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
let commentCallback = function(req, res, next){
    req.checkBody('action', '').notEmpty();
    req.checkBody('signature', '').isBase64();
    // console.log(action,'---ds');
}
let comment = async function(req, res, next){
    req.checkBody('comment_author', '评论者不可为空 且长度在 2 to 18 ').notEmpty().len(2,18);
    req.checkBody('comment_author_email', '评论者邮箱格式不符').notEmpty().isEmail();
    req.checkBody('comment_content', '评论内容不可为空').notEmpty().isLength({max:300});
    req.checkBody('posts_id', '评论文章呢？！').isAlphanumeric().len(24);

    let result = await req.getValidationResult();
    if(!result.isEmpty()){
        let map = { code: 1, msg: result.array()[0].msg };
        return res.status(400).json(map);
    }else{
        const token = req.cookies.u;
        let user_id = null;
        if(token){
            let temp =jsonwebtoken.decode(token);
            user_id = temp.id;
            // 登录的用户有权利疯狂更换马甲，谁让我是管理员呢;
        }
        const comment_author = req.body.comment_author,
            comment_post_id = req.body.posts_id,
            comment_author_email = req.body.comment_author_email,
            comment_author_url = req.body.comment_author_url,
            comment_author_avatar = req.body.comment_author_avatar,
            comment_content = req.body.comment_content,
            comment_parent = req.body.comment_parent,
            comment_agent = req.headers['user-agent'],
            comment_author_ip = utils.getClientIp(req);
            // user_id = null;
            // comment_approved = true,

        const maxAge = 365*5*60000*60*24,
              httpOnly = true;
        res.cookie("comment_author", comment_author, {maxAge , httpOnly });
        res.cookie("comment_author_email", comment_author_email, {maxAge , httpOnly });
        res.cookie("comment_author_url", comment_author_url, {maxAge , httpOnly });
        try {
            let data = {
                comment_post_id, comment_author, comment_author_email, comment_author_url,
                comment_content, comment_agent, comment_author_ip, comment_parent,user_id,comment_date:new Date()
            };
            result = await commentDao.asyncInsert(data)
            result.comment_agent = useragent.parse(result.comment_agent).os.family;
            result.comment_date = moment(result.comment_date).format('YYYY/MM/DD HH:mm:ss')
            res.map = { code :0, msg:'评论成功', data:result }

            // TODO: 验证码机制
        } catch (e) {
            res.map = { code: 1, msg: e.message, }
        } finally {
            next();
        }
    }
}
let comments = async function(req, res, next){
    req.checkBody('comment_post_id', '文章呢？！').isAlphanumeric().len(24);
    let result = await req.getValidationResult()
    if(!result.isEmpty()){
        let map = { code: 1, msg: result.array()[0].msg };
        return res.status(400).json(map);
    }else{
        const comment_post_id = req.body.comment_post_id;
        try {
            result = await commentDao.asyncGetCommentsByPosts(comment_post_id)
            let data = result.map((item)=>{
                // console.log(useragent.parse(item.comment_agent).device)
                // console.log(useragent.parse(item.comment_agent).os)
                item.comment_agent = useragent.parse(item.comment_agent).os.family;
                item.comment_date = moment(item.comment_date).format('YYYY/MM/DD HH:mm:ss')
                return item;
            })
            res.map = { code :0, data }
        } catch (e) {
            res.map = { code: 1, msg: e.message, }
        } finally {
            next();
        }
    }
}
module.exports = function() {
    let router = new Router();
    router.route("/read/:guid").get(read,function (req, res, next) {
        return res.status(200).json(res.map);
    });
    // router.route("/commentCallback").post(commentCallback);
    router.route("/comment").post(comment, function (req, res, next) {
        return res.status(200).json(res.map);
    })
    router.route("/comments").post(comments, function (req, res, next) {
        return res.status(200).json(res.map);
    })
    router.route("/:guid").get(loadArticleInfo).post(function(req, res, next){
        req.post_password = req.body.post_password;
        next();
    },loadArticleInfo);

    router.unless = require("express-unless");
    return router;
}
