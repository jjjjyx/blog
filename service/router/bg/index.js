const debug = require('debug')('app:routes:blog/index' + process.pid),
    Router = require("express").Router;


module.exports = function () {
    let router = new Router();
    router.get('/', function(req, res) {
        res.render('bg/index');
    });

    router.unless = require("express-unless");
    return router;
}
