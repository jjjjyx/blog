'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:article')
const {body, param} = require('express-validator/check')
const {sanitizeBody, sanitizeQuery} = require('express-validator/filter')
const readerPost = [
    param('p').isLength()
    function(req, res) {
        res.render('article-a');
    }
]

router.get('/:p', readerPost);

module.exports = router
