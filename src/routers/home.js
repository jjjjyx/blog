'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:home')

router.get('/', function(req, res, next) {
	res.render('home');
    // console.log("========== next ==========")
    // next()
});
router.get('/test', function(req, res, next) {
    res.render('test');
    // console.log("========== next ==========")
    // next()
});

module.exports = router
