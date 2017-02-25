let debug = require('debug')('app:routes:blog/index' + process.pid),
    Router = require("express").Router,
    xss = require('xss'),
    marked = require("marked"),
    renderer = new marked.Renderer(),
    postDao = require("../../dao/post.dao").postDao;
    // validator = require('node-validator');
// 为了将markdown 的内容全部提取出来 不包含符号
for(let i in renderer){
    renderer[i] = function(text){
        return text
    }
}

let indexLi = (data)=>{
    let s = "";
    data.forEach((item)=>{
        // console.log(marked(item.post_content,{renderer,sanitize:true}))
        // console.log($("*",marked(item.post_content)).text())
        s+=`
            <li data-node-id='${item.id}'>
               <div class="content">
                   <h4 class="title"><a href="p/${item.guid}" target="_blank">${xss(item.post_title)}</a></h4>
                   <div class="options am-fr">
                       <a class="read" href="p/${item.guid}" target="_blank">
                           <i class="am-icon-eye"></i>
                           <span class="num">${item.eye_count||0}</span>
                       </a>
                       <a class="comment" href="p/${item.guid}#comment" target="_blank">
                           <i class="am-icon-comment-o"></i>
                           <span class="num">${item.comment_count}</span>
                       </a>
                       <a class="like" >
                           <i class="am-icon-heart-o"></i>
                           <span class="num">${item.heart_count||0}</span>
                       </a>
                   </div>
                   <div class="meta am-margin-vertical-xs">
                       <a title="${xss(item.post_author)}" class="name" >${xss(item.post_author)}</a> ${new Date(item.post_date).format("yyyy-MM-dd hh:mm:ss")}
                   </div>
                   <p class="">
                        ${xss(marked(item.post_content,{renderer}))}...
                   </p>
                   <div class="j-category-tag">
                       <a class="category">${item.term_id}</a>
                       ${item.postTag ? `<i class="am-icon-tags"></i> <a>${item.postTag.replace(/,/g,"</a><a>")}</a>`:''}
                   </div>
               </div>
            </li>
        `
    })
    return s||"没有更多了";
}
    // request.getHeader("x-requested-with");
const loadPost = function(req, res, next){
    req.checkBody('pg','页码应为整数').isInt();
    req.checkBody('hasloadId').isArray()
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(map);
        }else{
            let hasloadId = req.body.hasloadId;
            let pg = req.body.pg
            postDao.getList({pg,hasloadId},indexLi,(err, data)=>{
                if(err){
                    res.map = "没有更多了";
                }else{
                    res.map = data;
                }
                next();
            })
        }
    });
}

module.exports = function () {
    let router = new Router();
    router.route("/").get(function(req, res) {
        req.checkQuery('hasloadId').isArray();
        req.getValidationResult().then(function(result) {
            if(!result.isEmpty()){
                let map = {
                    code: 1,
                    msg: result.array()[0].msg
                };
                return res.render('index');
            }else{
                let hasloadId = req.query.hasloadId;
                postDao.getList({hasloadId},indexLi,(err, data)=>{
                    res.render('index',{datali:data});
                })
            }

        });

    }).post(loadPost, function (req, res, next) {
        return res.status(200).send(res.map);
    });

    router.route("/p/:guid").get(function(req, res){

    })

    router.unless = require("express-unless");
    return router;
}
