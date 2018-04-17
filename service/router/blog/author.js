const debug = require('debug')('app:routes:blog/author' + process.pid),
    Router = require("express").Router,
    _ = require("lodash"),
    moment = require("moment"),
    utils = require('../../utils');

let loadArchivesDate = [
    function(req, res,next){
        req.renderData = {};
        next();
    }
];

module.exports = function() {
    let router = new Router();
    router.route("/").get(utils.visitorsfilter,loadArchivesDate,function(req, res) {
        res.render('author',req.renderData)
    });
    router.unless = require("express-unless");
    return router;
}
