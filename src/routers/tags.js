'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:tags')

router.get('/', function(req, res) {
    res.render('tags');
});

module.exports = router
