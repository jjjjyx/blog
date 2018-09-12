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
const common = require('./common')
const loadPostPageSize = 10
log.debug('loadPostPageSize = %d', loadPostPageSize)

const queryStickyPost = `
SELECT id FROM j_posts WHERE id IN (SELECT object_id FROM \`j_postmeta\` AS \`postMeta\` 
	LEFT JOIN \`j_term_relationships\` AS jtr ON jtr.\`object_id\` = postMeta.\`post_id\`
	LEFT JOIN \`j_terms\` AS jt ON jt.\`id\` = jtr.\`term_id\`
	WHERE \`postMeta\`.\`meta_key\` = 'sticky' AND \`postMeta\`.\`meta_value\` = '1')
	ORDER BY post_date DESC
	LIMIT 0, ?;`

const index = [
    // utils.cache.route('index'),
    async function(req, res, next) {
        try {
            // 获取置顶文章
            let stickyPostNum = SITE.stickyPostNum
            let result = await sequelize.query(queryStickyPost, {
                type: sequelize.QueryTypes.SELECT,
                replacements: [parseInt(stickyPostNum)]
            })
            let stickyPostIds = result.map((item) => item.id)

            debug('加载置顶文章 stickyPostNum = %d 个' , stickyPostNum)
            let stickyPost = await postDao.findAll({
                where:{id: stickyPostIds},
                include: common.postInclude
            })

            log.isDebugEnabled() && log.debug('获取置顶文章，共计 %d 篇, %s', result.length, result.map(post => '#' + post.id))

            let articleList = stickyPost.map(common.generatePostHtml).join('')
            articleList += await common.loadPost({page:1, pageSize: 10}, null, stickyPostIds)

            let sidebarModule = ['about', 'hot', 'chosen', 'category', 'tags', 'newest', 'archives', 'search']
            let sidebar = ''
            try {
                sidebar = await Promise.all(sidebarModule.filter((key) => _.isFunction(common.sidebarModule[key])).map((key) => common.sidebarModule[key]()))
                sidebar = sidebar.join('')
            } catch (e) {
                sidebar = '侧边栏加载失败'
                log.error('侧边栏加载失败 by :', e)
            }

            res.render('home', {articleList, sidebar});
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
            let result =  await common.loadPost({page, pageSize: 10})
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
