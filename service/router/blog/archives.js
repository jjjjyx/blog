const debug = require('debug')('app:routes:blog/archives' + process.pid),
    Router = require("express").Router,
    _ = require("lodash"),
    moment = require("moment"),
    utils = require('../../utils'),
    postDao = require("../../dao/post.dao");

let loadArchivesDate = [
    function(req, res,next){
        req.renderData = {};
        postDao.getPostsActivity((err, data) => {
            if(err){
                return res.status(400).json(map);
            }
            let group = {}
            data.forEach((item)=>{
                let time = moment(item.post_date).format("MMM YY")
                group[time] = group[time]||[]
                group[time].push(item);
            })
            req.renderData.groupList = group;
            next()
        })
    }
];

module.exports = function() {
    let router = new Router();
    router.route("/").get(loadArchivesDate,function(req, res) {
        res.render('archives',req.renderData)
    });
    router.unless = require("express-unless");
    return router;
}
