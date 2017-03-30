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
    req.checkBody('pg', '页码应为整数').isInt();
    req.checkBody('hasloadId').isArray()
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            let map = { code: 1, msg: result.array()[0].msg };
            return res.status(400).json(map);
        } else {
            let hasloadId = req.body.hasloadId;
            let pg = req.body.pg
            postDao.getList({ pg, hasloadId }, (err, data) => {
                if (err) {
                    res.map = "没有更多了";
                    next();
                } else {
                    res.map = data
                    return next();
                }
            }, utils.indexLi)
        }
    });
}
let getIndexData = [
    function(req, res,next) {
        req.checkQuery('hasloadId').isArray();
        req.getValidationResult().then(function(result) {
            let hasloadId = req.query.hasloadId;
            if (!result.isEmpty()) {
                hasloadId = null;
            }
            postDao.getList({ hasloadId }, (err, datali) => {
                req.renderData = {
                    datali
                };
                next()
            }, utils.indexLi)

        });
    },
    function(req, res,next) {
        termDao.loadCategory((err,termList)=>{
            req.renderData.termList = termList;
            next();
        });
    },
    function(req, res,next) {
        postDao.getPostsGroup((err, data) => {
            req.renderData.groupList = data;
            next()
        })
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
    router.route("/").get(getIndexData,function(req, res) {
        if(!_.isEmpty(req.renderData)){
            res.render('index', req.renderData)
        }

    }).post(loadPost, function(req, res, next) {
        return res.status(200).send(res.map);
    });
    router.unless = require("express-unless");
    return router;
}
