'use strict'

const express = require('express')

const _ = require('lodash')
const debug = require('debug')('app:routers:api.term')
const router = express.Router()
const {body} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')
const utils = require('../../utils')
const Result = require('../../common/resultUtils')
const {Enum} = require('../../common/enum')
const {termDao, postDao, sequelize} = require('../../models/index')

const {term_relationships: termRelationshipsDao } = sequelize.models
const Op = sequelize.Op

const sanitizeId = sanitizeBody('id').toInt()
const sanitizeName = sanitizeBody('name').escape().trim()
const sanitizeIcon = sanitizeBody('icon').escape().trim().customSanitizer((value)=>{
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
const checkId = body('id').isInt().withMessage("请提交正确的ID")
const checkName = body('name').isString().withMessage('请提交正确的名称').custom((value) => {
    debug('checkName name = ', value)
    return /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/.test(value)
}).withMessage('请提交正确的名称，名称只能包含中文英文，下划线，数字,且在长度不超过10！')

const slugMsg = '且名称只能包含英文，连字符（-），数字,且在长度不超过30！'
const slugV = (value) => {
    debug('checkSlug slug = ', value)
    return /^[a-zA-Z0-9\-_]{1,30}$/.test(value)
}
const checkSlug = body('slug').exists().withMessage('必须').custom(slugV).withMessage(slugMsg)
const checkSlug2 = body('slug').isLength({min: 0, max: 30}).custom(slugV).withMessage(slugMsg)
const checkDescription = body('description').isLength({min: 0, max: 140})
const checkIcon = body('icon').custom((value) => {
    // todo 验证 icon
    debug('checkIcon icon = ', value)
    return true
})
// const default_id = SITE.defaultCategoryId

const addTerm = [
    sanitizeName,
    sanitizeSlug,
    sanitizeIcon,
    checkName,
    checkSlug,
    checkIcon,
    checkDescription,
    utils.validationResult,
    async function (req, res, next) {
        let {name, slug, description, icon} = req.body
        debug(`addTerm name =[${name}], slug[${slug}]`)
        try {
            // 检查同名 ，检查 slug
            let result = await termDao.findOne({
                where: {
                    taxonomy: Enum.TaxonomyEnum.CATEGORY,
                    [Op.or]: [{name}, {slug}]
                }
            })
            if (result != null) {
                return res.status(200).json(Result.info('分类名称或别名已存在'))
            }
            result = await termDao.create({
                name, slug,taxonomy: Enum.TaxonomyEnum.CATEGORY,
                description, icon, count: 0
            })
            return res.status(200).json(Result.success(result.toJSON()))
        } catch (e) {
            debug('addTerm error by :', e.message)
            return res.status(200).json(Result.error())
        }
    }
]

const editTerm = [
    sanitizeId,
    sanitizeName,
    sanitizeIcon,
    checkId,
    checkName,
    checkSlug2,
    checkIcon,
    checkDescription,
    utils.validationResult,
    async function (req, res) {
        let {id, name, slug, description, icon} = req.body
        let values = {id, name, slug, description, icon}
        debug(`editTerm id= [${id}] name =[${name}], slug[${slug}]`)
        try {
            if (id === SITE.defaultCategoryId) {
                return res.status(200).json(Result.info('失败!此分类不可修改'))
            }
            // 检查同名 ，检查 slug
            let result = await termDao.findOne({
                where: {
                    taxonomy: Enum.TaxonomyEnum.CATEGORY,
                    id: { [Op.ne]: id },
                    [Op.or]: [{name}, {slug}]
                }
            })
            if (result != null) {
                return res.status(200).json(Result.info('分类名称或别名已存在! 修改失败'))
            }

            await termDao.update(values,{
                where:{
                    id: id
                }
            })
            return res.status(200).json(Result.success())
        } catch (e) {

            debug('editTerm error by :', e.message)
            return res.status(200).json(Result.error())
        }
    }
]
// 直接删除 不需要保留
const del = [
    // sanitizeId,
    // checkId,
    async function (req, res) {
        let {ids} = req.body
        if (!_.isArray(ids)) {
            ids = [ids]
        }
        // 删除掉文章的引用
        try {
            let terms = await termDao.findAll({
                where:{
                    id:{
                        [Op.in]: ids,
                        [Op.not]: SITE.defaultCategoryId
                    }
                }
            })
            if (terms.length) {
                // 调出标签与分类
                let fn = (item) => item.id
                let {category, post_tag} = _.groupBy(terms, (item) => item.taxonomy)
                category = category || []
                post_tag = post_tag || []
                let category_ids = category.map(fn)
                let post_tag_ids = post_tag.map(fn)
                debug(`del term id = [${category_ids},${post_tag_ids}] 其中标签：[${post_tag_ids}] ${post_tag_ids.length}个，分类：[${category_ids}], ${category_ids.length} 个`)
                // 分类的移动文章到默认分类
                if (category_ids.length){
                    termRelationshipsDao.update(
                        {term_id: SITE.defaultCategoryId},
                        {where: {term_id: category_ids}}
                    ).then(()=>{
                        // 删除分类
                        termDao.destroy({paranoid: false, force: true, where: {id: category_ids}})
                    })
                }
                // 标签直接删除
                // 删除对应关系
                if (post_tag_ids.length) {
                    let _destroy = {paranoid: false, force: true, where: {term_id: post_tag_ids}}
                    termRelationshipsDao.destroy(_destroy).then(() =>{
                        // 删除标签
                        termDao.destroy({paranoid: false, force: true, where: {id: post_tag_ids}})
                    })
                }
            }
            return res.status(200).json(Result.success())
        } catch (e) {
            debug('delTerm error by :', e.message)
            return res.status(200).json(Result.error())
        }
    }
]

// 标签=============
const addTag = [
    sanitizeName,
    sanitizeSlug,
    checkName,
    checkSlug,
    checkDescription,
    utils.validationResult,
    async function (req, res, next) {
        let {name, slug, description} = req.body
        debug(`addTag name =[${name}], slug[${slug}]`)
        try {
            // 检查同名 ，检查 slug
            let result = await termDao.findOne({
                where: {
                    taxonomy: Enum.TaxonomyEnum.POST_TAG,
                    [Op.or]: [{name}, {slug}]
                }
            })
            if (result != null) {
                return res.status(200).json(Result.info('标签名称或别名已存在'))
            }
            result = await termDao.create({
                name, slug, taxonomy: Enum.TaxonomyEnum.POST_TAG,
                description, count: 0
            })

            return res.status(200).json(Result.success(result.toJSON()))
        } catch (e) {
            debug('addTag error by :', e.message)
            return res.status(200).json(Result.error())
        }
    }
]

const editTag = [
    sanitizeId,
    sanitizeName,
    checkId,
    checkName,
    checkSlug2,
    checkDescription,
    utils.validationResult,
    async function (req, res) {
        let {id, name, slug, description} = req.body
        let values = {id, name, slug, description}
        debug(`editTerm id= [${id}] name =[${name}], slug[${slug}]`)
        try {
            // 检查同名 ，检查 slug
            let result = await termDao.findOne({
                where: {
                    taxonomy: Enum.TaxonomyEnum.POST_TAG,
                    id: { [Op.ne]: id },
                    [Op.or]: [{name}, {slug}]
                }
            })
            if (result != null) {
                return res.status(200).json(Result.info('标签名称或别名已存在! 修改失败'))
            }

            await termDao.update(values,{
                where:{
                    id: id
                }
            })
            return res.status(200).json(Result.success())
        } catch (e) {

            debug('editTerm error by :', e.message)
            return res.status(200).json(Result.error())
        }
    }
]

const getAll = [
    async function (req, res) {
        try {
            let result = await termDao.findAll({
                attributes: {
                    include:[
                        [sequelize.literal('(SELECT COUNT(`term_relationships`.`object_id`) FROM  `j_term_relationships` AS `term_relationships` WHERE `term_relationships`.`term_id` = `term`.`id` )'), 'count']
                    ]
                }
            })
            return res.status(200).json(Result.success(result))
        } catch (e) {
            console.log(e)
            debug('getAll error by :', e.message)
            return res.status(200).json(Result.error())
        }
    }
]

const test = [
    async function (req, res, next) {
        let term = await termDao.findById(19)
        console.log(term.toJSON())
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

router.route('/category/add').post(addTerm)
router.route('/category/edit').post(editTerm)
router.route('/category/del').post(del)

router.route('/tag/add').post(addTag)
router.route('/tag/edit').post(editTag)
router.route('/tag/del').post(del)

router.route('/del').post(del)
router.route('/').get(getAll)

// router.route('/test').get(test)

module.exports = router
