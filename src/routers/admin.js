'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:admin')

router.get('/', function(req, res) {
	res.render('admin');
});

module.exports = router