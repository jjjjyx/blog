'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:admin')
// const ejs = require('ejs');
// const html = require("./html");

router.get('/', function (req, res) {
    res.redirect('/jyx-admin/admin.html')
    // html.render("jyx-admin/admin.html",{names: ['foo', 'bar', 'baz']  })
})

module.exports = router
