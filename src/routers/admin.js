'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:admin')
// const ejs = require('ejs');

router.get('/', function(req, res) {
    // ejs
    // res.render('admin');
    res.redirect("/jyx-admin/admin.html")
});

module.exports = router
