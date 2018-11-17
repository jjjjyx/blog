'use strict'

const express = require('express')
const shortid = require('shortid')
const useragent = require('useragent')
const MarkdownIt = require('markdown-it')
const groupBy = require('lodash/groupBy')

const {body, param} = require('express-validator/check')
const debug = require('debug')('app:routers:article')
const log = require('log4js').getLogger('app:routers:article')
const hljs = require('highlight.js')
const common = require('../common/common')
const Result = require('../common/result')

// const {sanitizeBody, sanitizeQuery} = require('express-validator/filter')
const {termDao, userDao, postDao, postMetaDao, readDao, sequelize} = require('../models')
const router = express.Router()

const validGuid = (value) => shortid.isValid(value)
const md = new MarkdownIt({
    langPrefix: 'hljs language-',
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value
            } catch (e) {
                debug('highlight error by', e.message)
            }
        }

        return '' // use external default escaping
    }
})

const readerPost = [
    // param('p').exists().custom(validGuid),  //.isLength({min: 9, max: 16}),
    // common.validationResult,
    async function (req, res, next) {
        // console.log('========', req.session)
        let guid = req.params.p
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
        if (post === null) {
            return next()
        }
        res.render('article-a', {post, groupBy, md, cookies: req.cookies})
    }
]
const maxAge = 365 * 5 * 60000 * 60 * 24 // 5年
const httpOnly = true
const HEART_KEY = 'heart'
const incrementPostHeart = `UPDATE j_postmeta SET meta_value = meta_value + 1 WHERE post_id = (SELECT id FROM j_posts WHERE guid = ?) AND meta_key = '${HEART_KEY}'`
// const incrementPostHeart = `UPDATE j_postmeta SET meta_value = meta_value + 1 WHERE post_id = (SELECT id FROM j_posts WHERE guid = ?) AND meta_key = 'heart'`
const heart = [
    body('guid').custom(validGuid),
    common.validationResult,
    async function (req, res, next) {
        let guid = req.body.guid
        let cookiesKey = `${HEART_KEY}_${guid}`
        if (req.cookies[cookiesKey]) {
            return res.status(200).json(Result.info('刷赞可耻 ~ 拒绝刷赞'))
        }
        try {
            // postMetaDao.
            let [, metadata] = await sequelize.query(incrementPostHeart, {replacements: [guid]})
            if (metadata.changedRows === 0) {
                // common.createMetaByMetaDao(postMetaDao, {post_id: })
                let post = await postDao.findOne({
                    where: {guid}, attributes: ['id']
                })
                if (post === null) {
                    return res.status(200).json(Result.info('刷赞可耻 ~ 拒绝刷赞'))
                }
                await common.updateOrCreatePostMeta(post.id, HEART_KEY, 1)
            }
            res.cookie(cookiesKey, guid, {maxAge, httpOnly})
            return res.status(200).json(Result.success())
        } catch (e) {
            log.error('heart error by:', e)
            return res.status(200).json(Result.error())
        }
    }
]

const READ_KEY = 'read'
const incrementPostRead = `UPDATE j_postmeta SET meta_value = meta_value + 1 WHERE post_id = (SELECT id FROM j_posts WHERE guid = ?) AND meta_key = '${READ_KEY}'`
const read = [
    body('guid').custom(validGuid),
    common.validationResult,
    async function (req, res, next) {
        let guid = req.body.guid
        let ip = req.clientIp
        let useragent = req.headers['user-agent']
        let cookiesKey = `${READ_KEY}_${guid}`

        if (req.cookies[cookiesKey]) {
            return res.status(200).json(Result.success())
        }
        try {
            let post = await postDao.findOne({
                where: {guid: guid}, attributes: ['id']
            })
            if (post != null) {
                await readDao.create({guid, ip, useragent})
                debug('阅读成功， 虽然我也没办检查是不是真的读过了')
                let [, metadata] = await sequelize.query(incrementPostRead, {replacements: [guid]})
                if (metadata.changedRows === 0) {
                    await common.updateOrCreatePostMeta(post.id, READ_KEY, 1)
                }
                res.cookie(cookiesKey, guid, {maxAge, httpOnly})
            }
        } catch (e) {
            log.error('阅读文章失败 guid = %s, ip = %s', guid, ip, e)
        }
        return res.status(200).json(Result.success())
    }
]

router.get('/:p', readerPost)
router.post('/heart', heart)
router.post('/read', read)


module.exports = router
