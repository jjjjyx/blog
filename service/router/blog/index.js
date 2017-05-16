const debug = require('debug')('app:routes:blog/index' + process.pid),
    Router = require("express").Router,
    request = require('request-json'),
    _ = require("lodash"),
    utils = require('../../utils'),
    postDao = require("../../dao/post.dao"),
    termDao = require("../../dao/term.dao"),
    siteDao = require("../../dao/site.dao"),
    visitorsDao = require("../../dao/visitors.dao");
// validator = require('node-validator');

// request.getHeader("x-requested-with");
const loadPost = function(req, res, next) {
    req.checkBody('page').isInt({min:1});
    // req.checkBody('slug').len(6);
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            let map = { code: 1, msg: result.array()[0].msg };
            return res.status(400).json(map);
        } else {
            let page = req.body.page,slug,rows = 10;
            if(req.body.slug&&req.body.slug.length==6){
                slug = req.body.slug
            }
            postDao.getList({ page,rows,slug }, (err, data) => {
                if (err) {
                    res.map = {
                        code:-1,
                        msg:'内部服务错误！又有bug 要调了'
                    };
                    next();
                } else {
                    res.map = {};
                    if(data.data.length<rows||data.html=='没有更多了'){
                        res.map.next = ''
                    }else{
                        res.map.next = page*1+1;
                    }
                    res.map.data= data.html;
                    res.map.code= 0;
                    return next();
                }
            }, utils.indexLi)
        }
    });
}
let getIndexData = [
    function(req, res,next) {
        postDao.getList({}, (err, datali) => {
            req.renderData = {
                datali:datali.html
            };
            next()
        }, utils.indexLi)
    },
    function(req, res,next) {
        termDao.loadCategory((err,termList)=>{
            req.renderData.termList = termList;
            next();
        });
    },
    async function(req, res,next) {
        // postDao.getPostsGroup((err, data) => {
        //     req.renderData.groupList = data;
        //     next()
        // })
        let data = await postDao.asyncGetPostsGroup();
        req.renderData.groupList = data;
        next()
    },
    function(req, res,next) {
        siteDao.get((err, data) => {
            let d = {}
            data.forEach((item)=>{
                d[item.key] = item.value
            })
            req.renderData.site = d;
            next()
        })
    }
];

module.exports = function() {
    let router = new Router();
    router.route("/").get(utils.visitorsfilter, getIndexData, function(req, res) {
        if(!_.isEmpty(req.renderData)){
            res.render('index', req.renderData)
        }

    }).post(loadPost, function(req, res, next) {
        return res.status(200).send(res.map);
    });
    router.unless = require("express-unless");
    return router;
}
