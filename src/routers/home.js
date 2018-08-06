'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:home')
const index = [
    
    function(req, res, next) {
        res.render('home');
        // console.log("========== next ==========")
        // next()
    }
]


router.route('/').get();
router.get('/test', function(req, res, next) {
    res.render('test');
    // console.log("========== next ==========")
    // next()
});

module.exports = router
