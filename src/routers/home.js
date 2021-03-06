'use strict'

const express = require('express')
// const debug = require('debug')('app:routers:home')
// const log = require('log4js').getLogger('routers:home')
// const opLog = require('log4js').getLogger('op.routers:home')
const isFunction = require('lodash/isFunction')

const Result = require('../common/result')
const utils = require('../utils')
const common = require('../common')
const log = require('../common/manageLog')('routers:home')

const { postDao, termDao, sequelize } = require('../models')

const router = express.Router()
const loadPostPageSize = common.CONSTANT.LOAD_POST_PAGE_SIZE
const cacheTimeOut = config.cacheTimeOut

log.trace('首页加载文章个数 loadPostPageSize = %d', loadPostPageSize)
log.trace('动态页面内容缓存过期时间 cacheTimeOut = %d 秒', cacheTimeOut)

const queryStickyPost = `
SELECT id FROM j_posts WHERE id IN (SELECT object_id FROM \`j_postmeta\` AS \`postMeta\` 
LEFT JOIN \`j_term_relationships\` AS jtr ON jtr.\`object_id\` = postMeta.\`post_id\` 
LEFT JOIN \`j_terms\` AS jt ON jt.\`id\` = jtr.\`term_id\` 
WHERE \`postMeta\`.\`meta_key\` = 'sticky' AND \`postMeta\`.\`meta_value\` = '1') 
ORDER BY post_date DESC 
LIMIT 0, ?;`

const index = [
    utils.cache.route('index', config.cacheTimeOut),
    async function (req, res, next) {
        try {
            // 获取置顶文章
            let stickyPostNum = SITE.stickyPostNum
            let result = await sequelize.query(queryStickyPost, {
                type: sequelize.QueryTypes.SELECT,
                replacements: [parseInt(stickyPostNum)]
            })
            let stickyPostIds = result.map((item) => item.id)

            log.trace('加载置顶文章 stickyPostNum = %d 个', stickyPostNum)
            let stickyPost = await postDao.findAll({
                where: { id: stickyPostIds },
                include: common.postInclude
            })

            log.trace('获取置顶文章，共计 %d 篇, %s', stickyPost.length, stickyPost.map(post => '#' + post.id))

            let articleList = stickyPost.map(common.generatePostHtml).join('')
            let stickyPostGuid = stickyPost.map((item) => item.guid)
            articleList += await common.loadPostHtml({ pageSize: loadPostPageSize }, null, stickyPostGuid)

            let sidebarModule = ['about', 'hot', 'chosen', 'category', 'tags', 'newest', 'archives', 'search']
            let sidebar = ''
            try {
                sidebar = await Promise.all(sidebarModule.filter((key) => isFunction(common.sidebarModule[key])).map((key) => common.sidebarModule[key]()))
                sidebar = sidebar.join('')
            } catch (e) {
                sidebar = '侧边栏加载失败'
                log.error('侧边栏加载失败 by :', e)
            }
            log.info('访问首页')
            res.render('home', { articleList, sidebar })
        } catch (e) {
            next(e)
        }
        // 文章列表的展示
    }
]

const more = [
    // sanitizeQuery('ids').toInt(),
    // query('page').isInt(),
    // common.validationResult,
    async function (req, res, next) {
        // let { page } = req.query
        req.sanitizeQuery('ids').toArray()
        let { ids, slug } = req.query

        try {
            let term = null
            if (slug) {
                term = await termDao.findOne({
                    where: {
                        slug,
                        taxonomy: common.ENUMERATE.TaxonomyEnum.CATEGORY
                    }
                })
            }
            // return (await exports.loadPost.call(this, ...a)).map(exports.generatePostHtml).join('')
            let result = await common.loadPost({ pageSize: loadPostPageSize }, term, ids)

            let data = {
                result: result.map(common.generatePostHtml),
                next: result.length === loadPostPageSize
            }
            // let result = await common.loadPostHtml({ page, pageSize: 10 })
            return res.status(200).json(Result.success(data))
            // res.send(result)
        } catch (e) {
            log.error('loadPost  error by:', e)
            return res.status(200).json(Result.error())
        }
    }
]

router.route('/').get(index)
router.route('/more').get(more)
router.get('/test', function (req, res, next) {
    res.render('test', { req })
    // console.log("========== next ==========")
    // next()
})

module.exports = router
