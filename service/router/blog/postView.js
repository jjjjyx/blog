let debug = require('debug')('app:routes:blog/index' + process.pid),
    path = require('path'),
    Router = require("express").Router,
    xss = require('xss'),
    marked = require("marked"),
    renderer = new marked.Renderer(),
    postDao = require("../../dao/post.dao").postDao;


module.exports = function() {
    let router = new Router();
    router.route("/p/:guid").get(function(req, res) {

        res.render('p', {
            html
        });

    })

    router.unless = require("express-unless");
    return router;
}
