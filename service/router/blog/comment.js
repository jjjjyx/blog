const debug = require('debug')('app:routes:blog/comment' + process.pid),
    Router = require("express").Router,
    path = require('path'),
    xss = require('xss'),
    utils = require('../../utils'),
    useragent = require('useragent'),
    commentDao = require("../../dao/comment.dao"),
    jsonwebtoken = require("jsonwebtoken"),
    imgList = require("./avatar.json"),
    rateLimiter = require('redis-rate-limiter'),
    redis = require("redis"),
    client = redis.createClient(),
    moment = require("moment");

    // let start = 1494586842;
    // for(let i = 10;i<=70;i++){
    //     start += Math.floor(Math.random()*700);
    //     let d = moment(new Date(start*1000)).format('YYYY/MM/DD HH:mm:ss');
    //     let sql = `UPDATE j_comments SET comment_date = '${d}',comment_author_avatar = '${imgList[Math.floor(Math.random() * imgList.length)]}',comment_approved = 0 WHERE comment_id = '${i}';`;
    //     console.log(sql);
    // }
const maxAge = 365*5*60000*60*24,
          httpOnly = true;

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
            comment_parent = req.body.comment_parent||undefined,
            comment_agent = req.headers['user-agent'],
            comment_author_ip = utils.getClientIp(req);
            // user_id = null;
            // comment_approved = true,

        res.cookie("comment_author", comment_author, {maxAge , httpOnly });
        res.cookie("comment_author_email", comment_author_email, {maxAge , httpOnly });
        res.cookie("comment_author_url", comment_author_url, {maxAge , httpOnly });
        try {
            let data = {
                comment_post_id, comment_author, comment_author_email, comment_author_url,
                comment_author_avatar,
                comment_content, comment_agent, comment_author_ip, comment_parent,user_id,comment_date:new Date()
            };
            result = await commentDao.asyncInsert(data)
            result.comment_agent = useragent.parse(result.comment_agent).os.family;
            result.comment_date = moment(result.comment_date).format('YY/MM/DD H:mm:ss');
            let tmp = result.comment_author_ip.split(/\.|:/)
            if(tmp.length==4){
                tmp[1] = "*";
                tmp[2] = "*";
            }
            result.comment_author_ip = tmp.join(".")
            res.map = { code :0, msg:'评论成功', data:result }
            if(comment_parent) {
                res.map.code = 100;
                res.map.msg = "回复成功";
            }
            // TODO: 验证码机制
        } catch (e) {
            res.map = { code: 1, msg: "啊哦！发生错误咯！我会尽快修复的！" }
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
            let comments = {}
            let keys= [];
            result.forEach((item)=>{
                item.comment_agent = useragent.parse(item.comment_agent).os.family;
                item.comment_date = moment(item.comment_date).format('YY/MM/DD H:mm:ss');
                let tmp = item.comment_author_ip.split(/\.|:/)
                if(tmp.length==4){
                    tmp[1] = "*";
                    tmp[2] = "*";
                }
                item.comment_author_ip = tmp.join(".")
                switch (item.comment_approved) {
                    case 1:
                        item.comment_content = "评论没有被删除！"
                        break;
                    case 2:
                        item.comment_content = "评论没有被批准！"
                        break;
                    case 0:
                    default:
                        item.comment_content = xss(item.comment_content);
                }
                comments[item.comment_id] = item;
                if(item.comment_parent){
                    let parent = comments[item.comment_parent];
                    if(!parent.replyList){
                        parent.replyList = []
                    }
                    parent.replyList.push(item);
                }else {
                    keys.push(item);
                }
                // keys.push({comment_date:item.comment_date,comment_id:item.comment_id})
            });
            //  = Object.keys(comments);
            res.map = { code :0, data:keys, groupNum:3, rows: 10 }
        } catch (e) {
            console.log(e);
            res.map = { code: 1, msg: "啊哦！发生错误咯！我会尽快修复的！", }
        } finally {
            next();
        }
    }
}

// let getAvatar = function(req,res,next){
//
// }

module.exports = function () {
    let router = new Router();
    router.route('/getAvatar').get(rateLimiter.middleware({redis: client, key: 'ip', rate: '5/minute'}), function(req, res) {
        let comment_author_url = imgList[Math.floor(Math.random() * imgList.length)]
        res.cookie("comment_author_avatar", comment_author_url, { maxAge , httpOnly });
        res.status(200).json({code:0,url:comment_author_url});
    });
    // router.route("/commentCallback").post(commentCallback);
    router.route("/comment").post(rateLimiter.middleware({redis: client, key: 'ip', rate: '5/minute'}),comment, function (req, res, next) {
        return res.status(200).json(res.map);
    })
    router.route("/comments").post(comments, function (req, res, next) {
        return res.status(200).json(res.map);
    })
    router.unless = require("express-unless");
    return router;
}
