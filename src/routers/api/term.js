'use strict'

const express = require('express')
const groupBy = require('lodash/groupBy')
const debug = require('debug')('app:routers:api.term')
const log = require('log4js').getLogger('api.term')

const {body} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')

const {termDao, sequelize} = require('../../models/index')
const utils = require('../../utils')
const Result = require('../../common/result')
const {Enum} = require('../../common/enum')
const common = require('../../common/common')

const {term_relationships: termRelationshipsDao} = sequelize.models
const Op = sequelize.Op
const router = express.Router()

const sanitizeId = sanitizeBody('id').toInt()
const sanitizeName = sanitizeBody('name').escape().trim()
const sanitizeIcon = sanitizeBody('icon').escape().trim().customSanitizer((value) => {
    if (!value) {
        return 'iconfont icon-ziyuan1'
    }
    return value
})
// 当请求未提交slug 的时候不启作用
const sanitizeSlug = sanitizeBody('slug').trim().customSanitizer((value) => {
    debug('sanitizeSlug slug = ', value)
    if (!value) {
        return utils.randomChar(6)
    } else {
        return value
    }
})
const checkId = body('id').isInt().withMessage('请提交正确的ID')
const checkName = body('name').isString().withMessage('请提交正确的名称').custom((value) => {
    debug('checkName name = ', value)
    return common.REGS.TERM_NAME_REG.test(value)
}).withMessage('请提交正确的名称，名称只能包含中文英文，下划线，数字,且在长度不超过30！')

const slugMsg = '且名称只能包含英文，连字符（-），数字,且在长度不超过30！'
const slugV = (value) => {
    debug('checkSlug slug = ', value)
    return common.REGS.TERM_SLUG_REG.test(value)
}
const checkCreateSlug = body('slug').exists().withMessage('必须').custom(slugV).withMessage(slugMsg)
const checkUpdateSlug = body('slug').isLength({min: 0, max: 30}).custom(slugV).withMessage(slugMsg)
const checkDescription = body('description').isLength({min: 0, max: 140})
const checkIcon = body('icon').custom((value) => {
    // todo 验证 icon
    debug('checkIcon icon = ', value)
    return true
})
// const default_id = SITE.defaultCategoryId

const createTerm = async function (term) {
    try {
        let {name, slug, description, icon, taxonomy} = term
        debug(`createTerm taxonomy = %s, name = %s, slug = %s`, taxonomy, name, slug)

        // 检查同名 ，检查 slug
        let result = await termDao.findOne({
            where: {
                taxonomy,
                [Op.or]: [{name}, {slug}]
            }
        })
        if (result != null) {
            return Result.info('已存在')
        }
        result = await termDao.create({name, slug, taxonomy, description, icon})

        return Result.success(result.toJSON())
    } catch (e) {
        log.error('editTerm error by :', e)
        return Result.error()
    }
}

const updateTerm = async function (term) {
    try {
        let {name, slug, description, icon, taxonomy, id} = term

        debug(`updateTerm id = %s taxonomy = %s, name = %s, slug = %s`, id, taxonomy, name, slug)

        // 检查同名 ，检查 slug
        let result = await termDao.findOne({
            where: {
                taxonomy,
                id: {[Op.ne]: id},
                [Op.or]: [{name}, {slug}]
            }
        })
        if (result != null) {
            return Result.info('名称或别名已存在! ')
        }
        let values = {id, name, slug, description, icon}
        await termDao.update(values, {
            where: {
                id: id
            }
        })
        return Result.success()
    } catch (e) {
        log.error('updateTerm error by :', e)
        return Result.error()
    }
}

/**
 * 添加分类
 * @type {any[]}
 */
const addCategory = [
    sanitizeName,
    sanitizeSlug,
    sanitizeIcon,
    checkName,
    checkCreateSlug,
    checkIcon,
    checkDescription,
    common.validationResult,
    async function (req, res, next) {
        req.body.taxonomy = Enum.TaxonomyEnum.CATEGORY
        createTerm(req.body).then((result) => {
            res.status(200).json(result)
        })
    }
]

/**
 * 添加标签
 * @type {any[]}
 */
const addTag = [
    sanitizeName,
    sanitizeSlug,
    checkName,
    checkCreateSlug,
    checkDescription,
    common.validationResult,
    async function (req, res, next) {
        req.body.taxonomy = Enum.TaxonomyEnum.POST_TAG
        createTerm(req.body).then((result) => {
            res.status(200).json(result)
        })
    }
]

const editCategory = [
    sanitizeId,
    sanitizeName,
    sanitizeIcon,
    checkId,
    checkName,
    checkUpdateSlug,
    checkIcon,
    checkDescription,
    common.validationResult,
    async function (req, res) {
        let {id} = req.body
        if (id === SITE.defaultCategoryId) {
            return res.status(200).json(Result.info('默认分类不可修改'))
        }
        updateTerm(req.body).then((result) => {
            return res.status(200).json(result)
        })
    }
]

const editTag = [
    sanitizeId,
    sanitizeName,
    checkId,
    checkName,
    checkUpdateSlug,
    checkDescription,
    common.validationResult,
    async function (req, res) {
        let {id} = req.body
        if (id === SITE.defaultCategoryId) {
            return res.status(200).json(Result.info('默认分类不可修改'))
        }
        updateTerm(req.body).then((result) => {
            return res.status(200).json(result)
        })
    }
]

// 直接删除 不需要保留
const del = [
    // sanitizeId,
    // checkId,
    async function (req, res) {
        req.sanitizeBody('ids').toArray()
        let {ids} = req.body
        // 删除掉文章的引用
        try {
            let terms = await termDao.findAll({
                where: {
                    id: {
                        [Op.in]: ids,
                        [Op.not]: SITE.defaultCategoryId
                    }
                }
            })
            if (terms.length) {
                // 调出标签与分类
                let fn = (item) => item.id
                let {category, post_tag} = groupBy(terms, (item) => item.taxonomy)
                category = category || []
                post_tag = post_tag || []
                let category_ids = category.map(fn)
                let post_tag_ids = post_tag.map(fn)
                debug(`del term id = [${category_ids},${post_tag_ids}] 其中标签：[${post_tag_ids}] ${post_tag_ids.length}个，分类：[${category_ids}], ${category_ids.length} 个`)
                // 分类的移动文章到默认分类
                if (category_ids.length) {
                    termRelationshipsDao.update(
                        {term_id: SITE.defaultCategoryId},
                        {where: {term_id: category_ids}}
                    ).then(() => {
                        // 删除分类
                        termDao.destroy({paranoid: false, force: true, where: {id: category_ids}})
                    })
                }
                // 标签直接删除
                // 删除对应关系
                if (post_tag_ids.length) {
                    let _destroy = {paranoid: false, force: true, where: {term_id: post_tag_ids}}
                    termRelationshipsDao.destroy(_destroy).then(() => {
                        // 删除标签
                        termDao.destroy({paranoid: false, force: true, where: {id: post_tag_ids}})
                    })
                }
            }
            return res.status(200).json(Result.success())
        } catch (e) {
            log.error('delTerm error by', e)
            return res.status(200).json(Result.error())
        }
    }
]

const getAll = async function (req, res) {
    try {
        let result = await termDao.findAll({
            attributes: {
                include: [
                    [sequelize.literal('(SELECT COUNT(`term_relationships`.`object_id`) FROM  `j_term_relationships` AS `term_relationships` WHERE `term_relationships`.`term_id` = `term`.`id` )'), 'count']
                ]
            }
        })
        return res.status(200).json(Result.success(result))
    } catch (e) {
        log.error('getAll error by ', e)
        return res.status(200).json(Result.error())
    }
}

const test = [
    async function (req, res, next) {
        let term = await termDao.findById(19)
        term.countPosts()
        // console.log(Object.getOwnPropertyDescriptors(term))
        // console.log(term.property)
        // let test = await term.countPosts()
        // console.log(test)
        // let post = await postDao.findById(77)
        // await term.addPosts(post)
        // test = await term.countPosts()
        // console.log(test)
        // termRelationshipsDao.update(
        //             {term_id: SITE.defaultCategoryId},
        //             {where: {term_id: 19}}
        // ).then((...a)=>{
        //     console.log(...a)
        // })

        // let tags = await termDao.findAll({
        //     where: {
        //         id: [22,23,24]
        //     }
        // })
        // try {
        //     let aa = await tags.setPosts([])
        //     console.log(aa)
        // } catch (e) {
        //     console.log(e)
        // }

        return res.status(200).json('null')
    }
]

router.route('/category/add').post(addCategory)
router.route('/category/edit').post(editCategory)
router.route('/category/del').post(del)

router.route('/tag/add').post(addTag)
router.route('/tag/edit').post(editTag)
router.route('/tag/del').post(del)

router.route('/del').post(del)
router.route('/').get(getAll)

// router.route('/test').get(test)

module.exports = router
