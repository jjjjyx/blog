'use strict'

const express = require('express')

const debug = require('debug')('app:routers:category')
const log = require('log4js').getLogger('routers:category')
const {body, query} = require('express-validator/check')
const {sanitizeBody, sanitizeQuery} = require('express-validator/filter')

const {termDao, userDao, postDao, postMetaDao, sequelize} = require('../models')

const {term_relationships: termRelationshipsDao} = sequelize.models
const {Enum} = require('../common/enumerate')
const common = require('../common')
const utils = require('../utils')

const Op = sequelize.Op
const router = express.Router()

const renderCategoryList = [
    async function (req, res, next) {
        try {
            let list = await common.loadCategory(100)
            res.render('category-list', {list})
        } catch (e) {
            next(e)
        }
    }
]
// 不能做到查询到管理关系，所以只把id 跟顺序查询出来即可
const queryCategorySticky = `
SELECT id FROM j_posts WHERE id IN (SELECT object_id FROM \`j_postmeta\` AS \`postMeta\` 
	LEFT JOIN \`j_term_relationships\` AS jtr ON jtr.\`object_id\` = postMeta.\`post_id\`
	LEFT JOIN \`j_terms\` AS jt ON jt.\`id\` = jtr.\`term_id\`
	WHERE \`postMeta\`.\`meta_key\` = 'sticky' AND \`postMeta\`.\`meta_value\` = '1' AND jt.\`slug\`= ?)
	ORDER BY post_date DESC
	LIMIT 0, ?;`
const loadCategoryLength = 20
const renderCategory = [
    // param('slug').isLength({min: 6}),
    async function (req, res, next) {
        let slug = req.params.slug
        debug('查看 分类下文章列表 slug = %s', slug)
        // # 查询某分类下 置顶的文章
        try {
            let term = await termDao.findOne({
                where: {
                    slug
                }
            })
            if (term === null) {
                return next()
            }
            let stickyPostNum = SITE.stickyPostNum
            let result = await sequelize.query(queryCategorySticky, {
                type: sequelize.QueryTypes.SELECT,
                replacements: [slug, parseInt(stickyPostNum)]
            })
            let stickyPostIds = result.map((item) => item.id)
            debug('加载该置顶文章 stickyPostNum = %d 个', stickyPostNum)
            let stickyPost = await postDao.findAll({
                where: {id: stickyPostIds},
                include: common.postInclude
            })
            let articleList = stickyPost.map(common.generatePostHtml).join('')
            let posts = await common.loadPost({page: 1, pageSize: loadCategoryLength}, term, stickyPostIds)
            articleList += posts.map(common.generatePostHtml).join('')
            //
            res.render('category', {articleList, term, articleLength: posts.length, maxLength: loadCategoryLength})
        } catch (e) {
            log.error('renderCategory error by:', e)
            next()
        }
    }
]

const loadPostByTerm = [
    sanitizeQuery('page').toInt(),
    query('page').isInt(),
    common.validationResult,
    async function (req, res, next) {
        let slug = req.params.slug
        let page = req.query.page
        try {
            let term = await termDao.findOne({
                where: {
                    slug
                }
            })
            if (term === null) {
                return res.send('')
            }
            let result = await common.loadPostHtml({page, pageSize: 20}, term)
            res.send(result)
        } catch (e) {
            log.error('loadPostByTerm error by:', e)
            res.send('')
        }
    }
]

router.get('/', renderCategoryList)
router.get('/:slug', renderCategory)
router.get('/:slug/more', loadPostByTerm)

module.exports = router
