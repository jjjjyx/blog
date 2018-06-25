'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:api.term')
const {body} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')
const utils = require('../utils')
const Result = require('../common/resultUtils')
const {terms: termsDao, posts: postDao, term_relationships: termRelationshipsDao} = require('../models')
const {Enum} = require('../common/enum')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const sanitizeId = sanitizeBody('id').toInt()
const sanitizeName = sanitizeBody('name').escape().trim()
const sanitizeIcon = sanitizeBody('icon').escape().trim()
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
const checkName = body('name').isString().withMessage('请提交正确的分类').custom((value) => {
    debug('checkName name = ', value)
    return /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/.test(value)
}).withMessage('请提交正确的分类名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！')

const slugMsg = '且名称只能包含小写英文，连字符（-），数字,且在长度不超过30！'
const slugV = (value) => {
    debug('checkSlug slug = ', value)
    return /^[a-z0-9\-]{1,30}$/.test(value)
}
const checkSlug = body('slug').exists().withMessage('必须').custom(slugV).withMessage(slugMsg)
const checkSlug2 = body('slug').isLength({min: 0, max: 30}).custom(slugV).withMessage(slugMsg)
const checkDescription = body('description').isLength({min: 0, max: 140})
const checkIcon = body('icon').custom((value) => {
    debug('checkIcon icon = ', value)
    return true
})
const default_id = 1

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
            let result = await termsDao.findOne({
                where: {
                    taxonomy: Enum.TaxonomyEnum.CATEGORY,
                    [Op.or]: [{name}, {slug}]
                }
            })
            if (result != null) {
                return res.status(200).json(Result.info('分类名称或别名已存在'))
            }
            result = await termsDao.create({
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
            if (id === default_id) {
                return res.status(200).json(Result.info('失败!此分类不可修改'))
            }
            // 检查同名 ，检查 slug
            let result = await termsDao.findOne({
                where: {
                    taxonomy: Enum.TaxonomyEnum.CATEGORY,
                    term_id: { [Op.ne]: id },
                    [Op.or]: [{name}, {slug}]
                }
            })
            if (result != null) {
                return res.status(200).json(Result.info('分类名称或别名已存在! 修改失败'))
            }

            await termsDao.update(values,{
                where:{
                    term_id: id
                }
            })
            return res.status(200).json(Result.success())
        } catch (e) {

            debug('editTerm error by :', e.message)
            return res.status(200).json(Result.error())
        }
    }
]

const del = [
    sanitizeId,
    checkId,
    async function (req, res) {
        let {id} = req.body
        // 不可删除 默认分类，默认分类id = 1
        if (id === default_id) {
            return res.status(200).json(Result.info('失败!此分类不可删除'))
        }
        try {
            let term = await termsDao.findById(id)
            if (term === null) {
                return res.status(200).json(Result.info('删除失败!'))
            }
            debug(`del term id = [${id}] taxonomy = [${term.taxonomy}]`)
            // 如果是 分类
            if (term.taxonomy === Enum.TaxonomyEnum.CATEGORY) {
                // 移动改分类下的所有文章到默认分类
                await termRelationshipsDao.update({
                    term_id: default_id,
                },{
                    where: {
                        term_id: id,
                    }
                })
                // todo 更新分类下的文章个数
                // term = termsDao.findById(default_id)
                // let count =
            } else if (term.taxonomy === Enum.TaxonomyEnum.POST_TAG) { // 如果是标签
                // 删除所有文章引用
                await termRelationshipsDao.destroy({
                    where: {
                        term_id: id,
                    }
                })
            }
            // 删除分类
            await termsDao.destroy({
                where:{
                    term_id: id,
                }
            })
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
            let result = await termsDao.findOne({
                where: {
                    taxonomy: Enum.TaxonomyEnum.POST_TAG,
                    [Op.or]: [{name}, {slug}]
                }
            })
            if (result != null) {
                return res.status(200).json(Result.info('标签名称或别名已存在'))
            }
            result = await termsDao.create({
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
            let result = await termsDao.findOne({
                where: {
                    taxonomy: Enum.TaxonomyEnum.POST_TAG,
                    term_id: { [Op.ne]: id },
                    [Op.or]: [{name}, {slug}]
                }
            })
            if (result != null) {
                return res.status(200).json(Result.info('标签名称或别名已存在! 修改失败'))
            }

            await termsDao.update(values,{
                where:{
                    term_id: id
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
        let result = await termsDao.findAll()
        return res.status(200).json(Result.success(result))
    }
]

router.route('/c/add').post(addTerm)
router.route('/c/edit').post(editTerm)

router.route('/t/add').post(addTag)
router.route('/t/edit').post(editTag)

router.route('/del').post(del)
router.route('/').get(getAll)
module.exports = router
