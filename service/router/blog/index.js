let debug = require('debug')('app:routes:blog/index' + process.pid),
    Router = require("express").Router,
    xss = require('xss'),
    marked = require("marked"),
    renderer = new marked.Renderer(),
    postDao = require("../../dao/post.dao").postDao;
    // validator = require('node-validator');
// 为了将markdown 的内容全部提取出来 不包含符号
let textChar = (text)=> text||"";
let emptyChar = ()=> '';
for(let i in renderer){
    renderer[i] =textChar
}
renderer.list = emptyChar
renderer.hr = emptyChar
renderer.tablerow = emptyChar
renderer.table = emptyChar
renderer.image = (href, title, text)=>title||"";
renderer.link = (href, title, text)=>title||"";

let indexLi = (data)=>{
    let s = "";
    let pH =
    `<from class="password dimmer inverted ">
        <span class="am-icon-stack">
          <i class="am-icon-circle am-icon-stack-2x"></i>
          <i class="am-icon-lock am-icon-stack-1x white"></i>
        </span>
        <div class="am-form-group am-margin-top-sm">
            <input type="password" class="am-round" placeholder="输入访问密码" style="width">
            <button class="am-btn am-btn-success am-btn-sm am-round">
                <i class="am-icon-arrow-circle-right"></i>
            </button>
        </div>
    </from>
    `;
    data.forEach((item)=>{
        // console.log(marked(item.post_content,{renderer,sanitize:true}))
        // console.log($("*",marked(item.post_content)).text())
        // console.log(item)
        // console.log("====")
        s+=`
            <article data-node-id='${item.id}' class="${item.ppassword?'blurring  dimmable':''}">${item.ppassword?pH:''}
               <div class="content">
                   <h3 class="title"><a href="p/${item.guid}" target="_blank">${xss(item.post_title)}</a></h3>
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
                        ${xss(marked(item.post_content,{renderer}).substring(0,140))}...
                   </p>
                   <div class="j-category-tag">
                       <a class="category">${item.term_id}</a>
                       ${item.postTag ? `<i class="am-icon-tags"></i> <a>${item.postTag.replace(/,/g,"</a><a>")}</a>`:''}
                   </div>
               </div>
            </article>
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
    router.unless = require("express-unless");
    return router;
}
