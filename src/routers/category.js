'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:category')

router.get('/', function(req, res) {
    res.render('category');
});

module.exports = router
