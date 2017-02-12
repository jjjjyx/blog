let debug = require('debug')('app:routes:blog/index' + process.pid),
    Router = require("express").Router;
    // bcrypt = require("bcryptjs"),
    // path = require('path'),
    // utils = require('../utils');
    // termDao = require("../dao/term.dao").termDao;
    // validator = require('node-validator');

module.exports = function () {
    let router = new Router();
    router.get('/', function(req, res) {
        res.render('bg/index');
    });

    router.unless = require("express-unless");
    return router;
}
