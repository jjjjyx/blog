'use strict'

const express = require('express')
const debug = require('debug')('app:routers:home')
const log = require('log4js').getLogger('routers:home')
const _ = require('lodash')
const router = express.Router()
const Result = require('../common/resultUtils')
const {body, query} = require('express-validator/check')
const {sanitizeBody, sanitizeQuery} = require('express-validator/filter')
const {Enum} = require('../common/enum')
const {termDao, userDao, postDao, postMetaDao, sequelize, Sequelize} = require('../models')

const Op = sequelize.Op
const utils = require('../utils')
const common = require('../common/common')
const loadPostPageSize = 10
log.debug('loadPostPageSize = %d', loadPostPageSize)


const loadPost = async function (page = 1, term) {
    let where = {
        post_status: Enum.PostStatusEnum.PUBLISH,
    }
    let posts = await postDao.findAll({
        where,
        include: [
            {model: postMetaDao, as: 'metas'},
            {model: userDao, attributes: {exclude: ['user_pass']}},
            {model: termDao, attributes: ['icon', 'description', 'name', 'slug', 'taxonomy', 'id']}
        ],
        offset: (page - 1) * loadPostPageSize,
        limit: loadPostPageSize
    })
    debug('获取首页文章，共计 %d 篇', posts.length)
    log.debug('获取首页文章，共计 %d 篇, %s', posts.length, posts.map(post => '#'+post.id))
    // try {
    // 同步块中产生的异常 无法被错误拦截器捕获啊
    // let articleList =
    return posts.map(common.generatePostHtml).join('')
}

const index = [
    // utils.cache.route('index'),
    async function(req, res, next) {
        try {
            let articleList = await loadPost(1)
            res.render('home', {articleList});
        } catch (e) {
            next(e)
        }
        // 文章列表的展示
    }
]

const more = [
    sanitizeQuery('page').toInt(),
    query('page').isInt(),
    utils.validationResult,
    async function(req, res, next) {
        let {page} = req.query

        try {
            let result = await loadPost(page)
            res.send(result)
        } catch (e) {
            log.error('loadPost  error by:', e)
            return res.status(200).json(Result.error())
        }
    }
]

router.route('/').get(index);
router.route('/more').get(more);
router.get('/test', function(req, res, next) {
    res.render('test', {req});
    // console.log("========== next ==========")
    // next()
});

module.exports = router
