const debug = require('debug')('app:routes:blog/category' + process.pid),
    Router = require("express").Router,
    xss = require('xss'),
    marked = require("marked"),
    renderer = new marked.Renderer(),
    request = require('request-json'),
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

module.exports = function() {
    let router = new Router();
    router.route("/").get(loadCategoryDate,function(req, res) {
        res.render('category',req.renderData)
    });
    router.unless = require("express-unless");
    return router;
}
