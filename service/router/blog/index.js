let debug = require('debug')('app:routes:blog/index' + process.pid),
    Router = require("express").Router,
    // bcrypt = require("bcryptjs"),
    // path = require('path'),
    // utils = require('../utils');
    postDao = require("../../dao/post.dao").postDao;
    // validator = require('node-validator');
const loadPost = function(req, res, next){
    req.checkBody('pg','页码应为整数').isInt();
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(map);
        }else{
            postDao.getList(req.body.pg,(data)=>{
                let s = "";
                data.forEach((item)=>{
                    s+=`
                        <li>
                           <div class="content">
                               <h4 class="title"><a>${item.post_title}</a></h4>
                               <div class="options am-fr">
                                   <a class="read" >
                                       <i class="am-icon-eye"></i>
                                       <span class="num">${item.eye}</span>
                                   </a>
                                   <a class="comment" >
                                       <i class="am-icon-comment-o"></i>
                                       <span class="num">${item.comment_count}</span>
                                   </a>
                                   <a class="like" >
                                       <i class="am-icon-heart-o"></i>
                                       <span class="num">${item.heart_count}</span>
                                   </a>
                               </div>
                               <div class="meta am-margin-vertical-xs">
                                   <a title="${item.post_author}" class="name">${item.post_author}</a> ${item.post_date}
                               </div>
                               <p class="">
                                    ${item.post_content}
                               </p>
                               <div class="j-category-tag">
                                   <a class="category">java</a>
                                   <i class="am-icon-tags"></i>
                                   <a>c++</a>
                                   <a>.net</a>
                               </div>
                           </div>
                        </li>
                    `
                })
                return s;
            },(err, data)=>{
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
        console.log("hello world");
        res.render('index');
    }).post(loadPost, function (req, res, next) {
        console.log(res.map)
        return res.status(200).send(res.map);
    });


    router.unless = require("express-unless");
    return router;
}
