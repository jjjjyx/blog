'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:category')
const log = require('log4js').getLogger('routers:category')
const {body, query} = require('express-validator/check')
const {sanitizeBody, sanitizeQuery} = require('express-validator/filter')
const {Enum} = require('../common/enum')
const common = require('./common')
const {termDao, userDao, postDao, postMetaDao, sequelize} = require('../models')
const {term_relationships: termRelationshipsDao} = sequelize.models
const Op = sequelize.Op
const utils = require('../utils')

const renderCategoryList = [
    async function (req, res, next) {
        try {
            let list = await termDao.findAll({
                where: {
                    taxonomy: Enum.TaxonomyEnum.CATEGORY,
                    icon: {
                        [Op.not]: null,
                        [Op.ne]: ''
                    }
                },
                attributes: {
                    include: [
                        [sequelize.literal('(SELECT COUNT(`term_relationships`.`object_id`) FROM  `j_term_relationships` AS `term_relationships` LEFT JOIN j_posts AS jp ON `term_relationships`.`object_id`=jp.`id`  WHERE `term_relationships`.`term_id` = `term`.`id` AND jp.`post_status`= \'publish\')'), 'count']
                    ]
                }
            })
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
            articleList += await common.loadPost({page: 1, pageSize: 20}, term, stickyPostIds) // posts.map(common.generatePostHtml).join('')
            res.render('category', {articleList, term})
        } catch (e) {
            log.error('renderCategory error by:', e)
            next()
        }
    }
]

const loadPostByTerm = [
    sanitizeQuery('page').toInt(),
    query('page').isInt(),
    utils.validationResult,
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
            let result = await common.loadPost({page, pageSize: 20}, term)
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
