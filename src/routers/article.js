'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:article')
const {body, param} = require('express-validator/check')
const _ = require('lodash')

const MarkdownIt = require('markdown-it')
const md = new MarkdownIt();
// const {sanitizeBody, sanitizeQuery} = require('express-validator/filter')
const utils = require('../utils')
const {termDao, userDao, postDao, postMetaDao, sequelize} = require('../models')

const readerPost = [
    param('p').exists().isLength({min: 9, max: 9}),
    utils.validationResult,
    async function(req, res) {
        let guid = req.params.p;
        let post = await postDao.findOne({
            where: {
                guid
            },
            include: [
                {model: postMetaDao, as: 'metas'},
                {model: termDao},
                {model: userDao, attributes: {exclude: ['user_pass']}}
            ]
        })
        res.render('article-a', {post, _, md});
    }
]

router.get('/:p', readerPost);

module.exports = router
