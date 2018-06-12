'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:home')

router.get('/', function(req, res) {
	res.render('home');
});

module.exports = router
