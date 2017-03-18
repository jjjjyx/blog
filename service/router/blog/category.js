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



module.exports = function() {
    let router = new Router();
    router.route("/").get(function(req, res) {
        res.render('category')
    });
    router.unless = require("express-unless");
    return router;
}
