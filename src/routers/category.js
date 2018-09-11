'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:category')
const log = require('log4js').getLogger('routers:category')
const {body, query} = require('express-validator/check')
const {sanitizeBody, sanitizeQuery} = require('express-validator/filter')
const {Enum} = require('../common/enum')
const common = require('../common/common')
const {termDao, userDao, postDao, postMetaDao, sequelize} = require('../models')
const {term_relationships: termRelationshipsDao } = sequelize.models
const Op = sequelize.Op
const utils = require('../utils')

const renderCategoryList = [
    async function(req, res, next) {
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
                    include:[
                        [sequelize.literal('(SELECT COUNT(`term_relationships`.`object_id`) FROM  `j_term_relationships` AS `term_relationships` WHERE `term_relationships`.`term_id` = `term`.`id` )'), 'count']
                    ]
                }
            })
            res.render('category-list', {list});
        } catch (e) {
            next(e)
        }
    }
]
const renderCategory = [
    // param('slug').isLength({min: 6}),
    async function(req, res,next) {
        let slug = req.params.slug
        debug('查看 分类下文章列表 slug = %s', slug)
        try {
            let term = await termDao.findOne({
                where: {
                    slug
                }
            })
            if (term === null) {
                return next()
            }
            let articleList = await exports.loadPost({page:1, pageSize: 20}, term) // posts.map(common.generatePostHtml).join('')
            res.render('category', {articleList, term});
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
    async function(req, res, next) {
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
            let result = await exports.loadPost({page, pageSize: 20}, term)
            res.send(result)
        } catch (e) {
            log.error('loadPostByTerm error by:', e)
            res.send('')
        }
    }
]

router.get('/', renderCategoryList);
router.get('/:slug', renderCategory);
router.get('/:slug/more', loadPostByTerm);

module.exports = router



const postInclude = [
    {model: postMetaDao, as: 'metas'},
    {model: userDao, attributes: {exclude: ['user_pass']}},
    {model: termDao, attributes: ['icon', 'description', 'name', 'slug', 'taxonomy', 'id']}
]
module.exports.loadPost = async function({page = 1, pageSize = 10}, term) {
    let posts
    if (!term) {
        posts = await postDao.findAll({
            where:{
                post_status: Enum.PostStatusEnum.PUBLISH,
            },
            include: postInclude,
            offset: (page - 1) * pageSize,
            limit: pageSize
        })
    } else {
        let tp = await termRelationshipsDao.findAll({
            where: {
                term_id: term.id
            },
            offset: (page - 1) * pageSize,
            limit: pageSize
        })
        let postIds = tp.map((item) => item.object_id)

        posts = await postDao.findAll({
            where: {
                id: postIds
            },
            include: postInclude,
        })
    }
    log.debug('获取文章，共计 %d 篇, %s', posts.length, posts.map(post => '#'+post.id))
    return posts.map(common.generatePostHtml).join('')
}
