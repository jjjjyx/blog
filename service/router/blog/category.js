const debug = require('debug')('app:routes:blog/category' + process.pid),
    Router = require("express").Router,
    _ = require("lodash"),
    utils = require('../../utils'),
    postDao = require("../../dao/post.dao"),
    termDao = require("../../dao/term.dao");

let loadCategoryDate = [
    function(req, res,next) {
        req.renderData = {};
        termDao.loadCategory((err,termList)=>{
            req.renderData.termList = termList;
            next();
        });
    },
]
let loadPostBySlug = [
    function(req, res,next) { //获取分类信息
        req.renderData = {};
        req.checkParams('slug','链接不正确').len(6);
        req.getValidationResult().then(function(result) {
            if(!result.isEmpty()){
                return res.render("404");
            }else{
                let slug = req.params.slug
                termDao.loadCategoryBySlug(slug,(err,data)=>{
                    let termInfo = data[0];
                    if(_.isEmpty(termInfo)){
                        return res.render("404");
                    }
                    req.renderData.termInfo = termInfo;
                    next();
                });
            }
        });

    },
    function(req, res,next) {
        termDao.loadCategory((err,termList)=>{
            req.renderData.termList = termList;
            next();
        });
    },
    function(req, res,next) { // 获取分类的文章
        let slug = req.params.slug
        postDao.getList({ slug }, (err, datali) => {
            req.renderData.datali = datali.html;
            next()
        }, utils.indexLi)
    }
]

module.exports = function() {
    let router = new Router();
    router.route("/").get(loadCategoryDate,function(req, res) {
        res.render('category',req.renderData)
    });
    router.route("/:slug").get(loadPostBySlug,function(req, res) {
        res.render('list',req.renderData)
    });
    router.unless = require("express-unless");
    return router;
}
