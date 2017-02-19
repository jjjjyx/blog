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
        console.log("hello world");
        res.render('index');
    });

    router.get('/test', function(req, res) {
        console.log("hello world");
        res.render('index');
    });


    router.unless = require("express-unless");
    return router;
}
