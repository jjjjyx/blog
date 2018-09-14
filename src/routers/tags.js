'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:tags')
const common = require('./common')
const log = require('log4js').getLogger('routers:tags')
router.get('/', async function(req, res, next) {
    try {
        let tags = await common.loadTags()

        log.isDebugEnabled() && log.debug('tags ： 获取全部的标签 共计 %d 个 %s', tags.length, tags.map((tag) => `#${tag.id}:${tag.name}`))
        res.render('tags', {tags});
    } catch (e) {
        next(e)
    }
});

module.exports = router
