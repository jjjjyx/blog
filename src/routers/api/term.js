'use strict'

const express = require('express')
const groupBy = require('lodash/groupBy')
// const debug = require('debug')('app:routers:api.term')
// const log = require('log4js').getLogger('api.term')

const { body } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

const log = require('../../common/manageLog')('api.user')
const { termDao, sequelize } = require('../../models/index')
const utils = require('../../utils')
const Result = require('../../common/result')
const common = require('../../common')
const { term_relationships: termRelationshipsDao } = sequelize.models
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
    log.trace('sanitizeSlug slug = ', value)
    if (!value) {
        return utils.randomChar(6)
    } else {
        return value
    }
})
const checkId = body('id').isInt().withMessage('请提交正确的ID')
const checkName = body('name').isString().withMessage('请提交正确的名称').custom((value) => {
    log.trace('checkName name = ', value)
    return common.REGS.TERM_NAME_REG.test(value)
}).withMessage('请提交正确的名称，名称只能包含中文英文，下划线，数字,且在长度不超过30！')

const slugMsg = '且名称只能包含英文，连字符（-），数字,且在长度不超过30！'
const slugV = (value) => {
    log.trace('checkSlug slug = ', value)
    return common.REGS.TERM_SLUG_REG.test(value)
}
const checkCreateSlug = body('slug').exists().withMessage('必须').custom(slugV).withMessage(slugMsg)
const checkUpdateSlug = body('slug').isLength({ min: 0, max: 30 }).custom(slugV).withMessage(slugMsg)
const checkDescription = body('description').isLength({ min: 0, max: 140 })
const checkIcon = body('icon').custom((value) => {
    // todo 验证 icon
    log.trace('checkIcon icon = ', value)
    return true
})
// const default_id = SITE.defaultCategoryId
/**
 * 创建term 的公共方法
 * @param term
 * @param req
 * @returns {Promise<Result>}
 */
const createTerm = async function (term, req) {
    try {
        let { name, slug, description, icon, taxonomy } = term
        log.trace(`createTerm taxonomy = %s, name = %s, slug = %s`, taxonomy, name, slug)

        // 检查同名 ，检查 slug
        let result = await termDao.findOne({
            where: {
                taxonomy,
                [Op.or]: [{ name }, { slug }]
            }
        })
        if (result != null) {
            log.trace('Creation failed,, term = [%s] already exists', name, slug)
            return Result.info('已存在')
        }
        result = await termDao.create({ name, slug, taxonomy, description, icon })
        log.create(req, result, common.ENUMERATE.relatedTypeEnum[taxonomy])
        return Result.success(result.toJSON())
    } catch (e) {
        log.error('editTerm error by :', e)
        return Result.error()
    }
}

/**
 * 修改term 的公共方法
 * @param body req.body
 * @param req
 * @returns {Promise<Result>}
 */
const updateTerm = async function (body, req) {
    try {
        let { name, slug, description, icon, taxonomy, id } = body

        log.trace(`updateTerm id = %s taxonomy = %s, name = %s, slug = %s`, id, taxonomy, name, slug)

        // 检查同名 ，检查 slug
        let term = await termDao.findOne({
            where: {
                taxonomy,
                id: { [Op.ne]: id },
                [Op.or]: [{ name }, { slug }]
            }
        })
        if (term !== null) {
            log.trace('The modification failed, the name = [%s] or slug = [%s] already exists', name, slug)
            return Result.info('名称或别名已存在! ')
        }
        term = await termDao.findOne({
            where: {
                id
            }
        })
        if (term === null) {
            log.trace('The modification failed, the id = [%s] already exists', name, slug)
            return Result.info('term 不存在')
        }
        let oldObj = {
            name: term.name,
            slug: term.slug,
            description: term.description,
            icon: term.icon
        }

        term.name = name
        term.slug = slug
        term.description = description
        term.icon = icon
        await term.save()
        let newObj = {
            name: term.name,
            slug: term.slug,
            description: term.description,
            icon: term.icon
        }

        log.update(req, term, oldObj, newObj, common.ENUMERATE.relatedTypeEnum[taxonomy])
        return Result.success()
    } catch (e) {
        log.error('updateTerm error by :', e)
        return Result.error()
    }
}

/**
 * 添加分类
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
    async function (req, res) {
        req.body.taxonomy = common.ENUMERATE.TaxonomyEnum.CATEGORY
        createTerm(req.body, req).then((result) => {
            res.status(200).json(result)
        })
    }
]

/**
 * 添加标签
 */
const addTag = [
    sanitizeName,
    sanitizeSlug,
    checkName,
    checkCreateSlug,
    checkDescription,
    common.validationResult,
    async function (req, res) {
        req.body.taxonomy = common.ENUMERATE.TaxonomyEnum.POST_TAG
        createTerm(req.body, req).then((result) => {
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
        let { id } = req.body
        if (id === SITE.defaultCategoryId) {
            log.trace('The modification failed, the default classification cannot be modified.')
            return res.status(200).json(Result.info('默认分类不可修改'))
        }
        updateTerm(req.body, req).then((result) => {
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
        let { id } = req.body
        if (id === SITE.defaultCategoryId) {
            log.trace('Modification failed, wrong parameters')
            return res.status(200).json(Result.info('修改失败，错误的参数'))
        }
        updateTerm(req.body, req).then((result) => {
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
        let { ids } = req.body
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
                let { category, post_tag: postTag } = groupBy(terms, (item) => item.taxonomy)
                category = category || []
                postTag = postTag || []

                let categoryIds = category.map(fn)
                let postTagIds = postTag.map(fn)
                log.trace(`del term id = [${categoryIds},${postTagIds}] Among them, tags: [${postTagIds}] ${postTagIds.length} in total, categories: [${categoryIds}], ${categoryIds.length} in total`)
                // 分类的移动文章到默认分类
                if (categoryIds.length) {
                    termRelationshipsDao.update(
                        { term_id: SITE.defaultCategoryId },
                        { where: { term_id: categoryIds } }
                    ).then(() => {
                        // 删除分类
                        let categoryNames = postTag.map(item => `${item.id}#${item.name}`)
                        log.trace('Delete the category, move the category to the article to %s#%s', categoryNames, SITE.defaultTerm.id, SITE.defaultTerm.name)
                        log.delete(req, category, common.ENUMERATE.relatedTypeEnum.category)
                        termDao.destroy({ paranoid: false, force: true, where: { id: categoryIds } })
                    })
                }
                // 标签直接删除
                // 删除对应关系
                if (postTagIds.length) {
                    let _destroy = { paranoid: false, force: true, where: { term_id: postTagIds } }
                    termRelationshipsDao.destroy(_destroy).then(() => {
                        // 删除标签
                        let tagNames = postTag.map(item => `${item.id}#${item.name}`)
                        log.trace('Delete the article reference tag = [%s], affect the number of articles: %d', tagNames, postTagIds.length)
                        log.delete(req, postTag, common.ENUMERATE.relatedTypeEnum.post_tag)
                        termDao.destroy({ paranoid: false, force: true, where: { id: postTagIds } })
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
        log.trace('Get all terms')
        return res.status(200).json(Result.success(result))
    } catch (e) {
        log.error('getAll error by ', e)
        return res.status(200).json(Result.error())
    }
}
//
// const test = [
//     async function (req, res, next) {
//         let term = await termDao.findByPk(19)
//         term.countPosts()
//         // console.log(Object.getOwnPropertyDescriptors(term))
//         // console.log(term.property)
//         // let test = await term.countPosts()
//         // console.log(test)
//         // let post = await postDao.findByPk(77)
//         // await term.addPosts(post)
//         // test = await term.countPosts()
//         // console.log(test)
//         // termRelationshipsDao.update(
//         //             {term_id: SITE.defaultCategoryId},
//         //             {where: {term_id: 19}}
//         // ).then((...a)=>{
//         //     console.log(...a)
//         // })
//
//         // let tags = await termDao.findAll({
//         //     where: {
//         //         id: [22,23,24]
//         //     }
//         // })
//         // try {
//         //     let aa = await tags.setPosts([])
//         //     console.log(aa)
//         // } catch (e) {
//         //     console.log(e)
//         // }
//
//         return res.status(200).json('null')
//     }
// ]

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
