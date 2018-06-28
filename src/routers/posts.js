'use strict'

const express = require('express')
const _ = require('lodash')
const router = express.Router()
const debug = require('debug')('app:routers:api.posts')
const {body} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')
const utils = require('../utils')
const Result = require('../common/resultUtils')
const {Enum} = require('../common/enum')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {terms: termsDao, posts: postDao, term_relationships: termRelationshipsDao} = require('../models')

// id
const sanitizeId = sanitizeBody('id').toInt()
const checkId = body('id').exists().isInt().withMessage('请提交正确的文章ID')

const sanitizeCategoryId = sanitizeBody('category_id').toInt()
const checkCategoryId = body('category_id').exists().isInt().withMessage('请提交正确的分类ID')
//
// const sanitizeTagsId = sanitizeBody('tags_id').toArray()
const checkTagsId = body('tags_id').exists().isArray().withMessage('请提交正确的标签ID')

// 蛋疼提交为数组 这个不执行
// const sanitizeNewTagsName = sanitizeBody('new_tag*').customSanitizer((value)=>{/* console.log(value)*/debug(`sanitizeNewTagsName v = ${value}`)return value})
const checkNewTagsName = body('new_tag').exists().withMessage('请提交新建的标签')

// 标题
const sanitizeTitle = sanitizeBody('post_title').escape().trim()
const checkTitle = body('post_title').exists().isString().isLength({
    min: 0,
    max: 255
}).withMessage('请输入一个有效的标题，有效的标题长度在1~255')

// const sanitizeContent = sanitizeBody('sanitizeContent')
const checkContent = body('post_content').exists().isString().isLength({min: 0}).withMessage('请提交文章内容')
// 文章别名 必须提交 但是不满足格式不会报错而是启用
const checkPostName = body('post_name').exists().isString().isLength({min: 0}).withMessage('请提交文章内容')
const postNameReg = /^[_a-zA-Z0-9\-]{1,60}$/
// 摘录
const checkExcerpt = body('excerpt').exists().isString().isLength({min: 0}).withMessage('请提交文章摘录')

/**
 * 保存文章, 仅保存标题，内容，摘录
 * @type {*[]}
 */
const save = [
    sanitizeTitle,
    sanitizeId,
    checkTitle,
    checkId,
    checkContent,
    checkExcerpt,
    utils.validationResult,
    async function (req, res) {
        let {post_title, id, post_content, excerpt} = req.body
        try {
            // 保存的时候 如果文章当前状态是 auto_draft 则更新状态为草稿
            let post = await postDao.findById(id)
            if (post === null)
                return res.status(200).json(Result.info('保存失败，未提交正确的文章id'))

            // 提交id 只会有3种状态 auto-draft publish draft

            switch (post.post_status) {
            case Enum.PostStatusEnum.AUTO_DRAFT:
            case Enum.PostStatusEnum.DRAFT:
                debug(`保存的文章 = ${id} 当前状态为：${post.post_status}, 修改文章状态为：${Enum.PostStatusEnum.DRAFT}`)
                post.post_status = Enum.PostStatusEnum.DRAFT
                break
            case Enum.PostStatusEnum.PUBLISH:
                debug(`保存的文章 = ${id} 当前状态为：${post.post_status}`)
                // 如果是发布状态
                // 则去获取发布状态文章的自动草稿
                // 如果获取为空，则创建一个: ${id}--autosave-v1
                let autoSavePost = await postDao.findOne({
                    where: {
                        post_name: `${id}-autosave-v1`,
                        post_status: Enum.PostStatusEnum.INHERIT,
                        post_type: 'revision'
                    }
                })
                if (autoSavePost === null) {
                    debug(`文章 = ${id} 不存在自动存档，自动创建存档，存档内容与发布版本一致`)
                    let values = post.toJSON()
                    values.id = undefined
                    values.post_name = `${id}-autosave-v1`
                    values.post_type = 'revision'
                    values.post_status = Enum.PostStatusEnum.INHERIT
                    post = await postDao.create(values)
                }else {
                    post = autoSavePost
                }
                break
            default:
                return res.status(200).json(Result.info('保存失败，未提交正确的文章id'))
            }

            let values = {post_title, post_content, excerpt, post_status: post.post_status}
            debug(`文章 = ${id} 更新自动存档内容！`)
            await post.update(values)
            return res.status(200).json(Result.success())
        } catch (e) {
            debug('newPost error by:', e.message)
            return res.status(200).json(Result.error())
        }
    }
]

const newPost = [
    sanitizeTitle,
    checkTitle,
    // body('term_id').isEmpty().withMessage('test').isInt().withMessage('分类id 不正确'),
    utils.validationResult,
    async function (req, res) {
        let {post_title} = req.body
        try {
            let result = await postDao.create({
                post_author: req.user.id, post_content: '',
                post_title, post_excerpt: '', post_status: Enum.PostStatusEnum.AUTO_DRAFT,
                post_name: '', guid: ''
            })
            debug(`创建新的自动草稿，草稿ID = ${result.id}`)
            return res.status(200).json(Result.success(result.toJSON()))
        } catch (e) {
            debug('newPost error by:', e.message)
            return res.status(200).json(Result.error())
        }

    }
]
// 必须参数 文章id
// 文章的分类，没提交不给过，默认得放到未分类
// 文章的标签
// 文章的公开度
//    密码，置顶，
// 文章的发布时间 允许自定义，不提交为当前时间
// 评论状态
// 可选
// 作者
//
// 更新 ，发布接口
// 更新或发布将创建一个版本记录

const TagsLength = 16
const release = [
    sanitizeTitle,
    sanitizeId,
    sanitizeCategoryId,
    checkTagsId,
    checkTitle,
    checkId,
    checkContent,
    checkPostName,
    checkExcerpt,
    checkNewTagsName,
    checkCategoryId,
    checkTagsId,
    utils.validationResult,
    async function (req, res) {
        // todo 文章状态！！
        let {post_title, id, post_content, post_name, excerpt: post_excerpt, new_tag, tags_id, category_id} = req.body
        // post_excerpt = post_excerpt || ''

        let new_tags = new_tag
        if (!new_tags instanceof Array) {
            new_tags = [new_tag]
        }

        if (!tags_id instanceof Array) {
            tags_id = [tags_id]
        }

        try {
            let post = await postDao.findById(id)
            if (post === null)
                return res.status(200).json(Result.info('保存失败，未提交正确的文章id'))

            // 验证分类是否存在
            let category = await termsDao.findById(id,{attributes:['term_id']})
            if (category === null) {
                debug(`release 提交了未定义的分类id，自动修正为默认分类 ${SITE.defaultCategoryId}`)
                category_id = SITE.defaultCategoryId * 1
            }

            // 验证new_tag 的名字
            // /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/
            // 包含有错误的tag 驳回请求
            let testReg = new_tag.every((tag)=>utils.termReg.test(tag))
            if (!testReg) {
                return res.status(200).json(Result.info('错误的标签名称'))
            }

            // 验证tags_id
            // 如果tags_id 不存在则忽略
            let tags = await termsDao.findAll({
                where:{
                    taxonomy: Enum.TaxonomyEnum.POST_TAG,
                    term_id:{[Op.in]: tags_id}
                }
            })
            debug(`release 提交了标签ID个数 = ${tags_id.length} 个，其中 ${tags.length} 有效`)
            // 判断tags 的个数 个数的判断在创建标签之前
            if (TagsLength <= tags.length + new_tags.length) {
                return res.status(200).json(Result.info('标签太多啦！'))
            }
            // 对于新加的 new_tag 则去创建
            // 防止同名是个问题，虽然会在页面中做同名过滤，但是保不齐非法提交
            // 做法查询这些new_tag 是否存在, 存在的删除掉
            let newTags = await termsDao.findAll({
                where:{
                    taxonomy: Enum.TaxonomyEnum.POST_TAG,
                    name:{[Op.in]: new_tags}
                }
            })

            tags = tags.concat(newTags)
            let _newTags =  newTags.map((item)=>item.name)
            debug(`release 提交了标签名称：[${new_tags}]，其中[${_newTags}]是已存在的`)

            // 做差集
            new_tags = _.difference(new_tags, _newTags).map((name)=>({name,  taxonomy: Enum.TaxonomyEnum.POST_TAG, description: '', count: 0, slug: utils.randomChar(6)}))
            // 创建
            // bulkCreate
            if (new_tags.length) {
                debug(`release 创建其余未定义的标签：[${new_tags}]`)
                new_tags = await termsDao.bulkCreate(new_tags)
            }

            tags = tags.concat(new_tags)


            // 检查 post_name 格式， post_name 只能包含字母数组，下划线 连字符串，长度在60 之间
            if (!postNameReg.test(post_name)) {
                debug(`release 提交的post_name = ${post_name} 不符合规范, 将不做修改`)
                post_name = undefined
            }
            // 查询到文章所有用到的分类 + 标签
            termRelationshipsDao.findAll({
                where: {object_id: id}
            }).then(termRelationships=>{
                // 对没有做对应的做一次创建对应关系，并且更新文章个数
                // 更新标签，分类文章个数
                let ids = tags.map((item)=>item.term_id)
                ids.push(category_id)
                let thatIds = termRelationships.map(t=>t.term_id)
                debug(`release 文章${id} 对应了 ${termRelationships.length} 个关系 [${thatIds}]`)
                let _not = _.difference(ids, thatIds)
                debug(`release 文章${id} 本次提交了ids = [${ids}],其中[${_not}] 是新增的，创建关系`)
                // 创建文章标签对应表
                let createValues = _not.map((term)=>{
                    return {
                        object_id: id,
                        term_id: term
                    }
                })
                termRelationshipsDao.bulkCreate(createValues).then(()=>{
                    if (_not.length) {
                        // todo 这里会出现一个 异常 有时间修改
                        termsDao.update({
                            count: Sequelize.literal('`count` + 1')
                        }, {
                            where: {
                                term_id: {[Op.in]: _not}
                            }
                        })
                    }
                }).catch((err)=>{
                    debug("release update termRelationships error by:", err.message)
                })
            })

            // 修改post 状态
            let oldValues = {
                post_title: post.post_title,
                post_content: post.post_content,
                post_excerpt: post.post_excerpt
            }
            let newValues = {
                post_title, post_content, post_excerpt
            }
            post.post_title = post_title
            post.post_content = post_content
            post.post_excerpt = post_excerpt
            post.post_name = post_name || post.id
            post.post_status = Enum.PostStatusEnum.PUBLISH

            // 版本只对做 内容，标题，摘录 敏感
            await post.save()
            // 检查内容是否修改了，没有修改则不创建版本
            // debug(`是否修改了文章 = ${id}, result = ${result}`)
            let isModify = _.isEqual(newValues, oldValues)
            debug(`是否修改了文章 isModify = ${!isModify}`)
            console.log(newValues)
            console.log(oldValues)
            if (!isModify) {
                // 创建版本
                let values = post.toJSON()
                values.post_name = `${id}-revision-v1`
                values.post_status = Enum.PostStatusEnum.INHERIT
                values.post_type = 'revision'
                values.id = undefined
                postDao.create(values)
            }
            return res.status(200).json(Result.success())
        } catch (e) {
            console.log(e)
            debug('release post error by:', e.message)
            return res.status(200).json(Result.error())
        }
    }
]

// todo 删除，移动到回收站，都需要支持批量
const moverTrash = [
    body('ids').exists().isArray().withMessage('请提交正确的文章ID列表'),
    utils.validationResult,
    async function (req, res) {
        try {
            let {id} = req.body
            let post = await postDao.findById(id)
            if (post === null) {
                return res.status(200).json(Result.info('失败，未提交正确的文章id'))
            }
            // 删除文章
            debug(`del post id = [${id}]`)
            await post.destroy()
            return res.status(200).json(Result.success())
        } catch (e) {
            debug('getTrash error by:', e.message)
            return res.status(200).json(Result.error())
        }
    }
]
const getTrash = [
    async function (req, res) {
        try {
            // 有删除时间就是删除的
            // 是删除的 且删除时间小于 30天
            // 获取当前时间 - 30 天、
            let date = new Date()
            date.setDate(date.getDate() - 30)
            //
            debug(`获取回收站中内容`)
            let posts = await postDao.findAll({
                paranoid: false,
                where: {
                    [Op.or]: [
                        {deleteAt: {[Op.not]: null}},
                        {deleteAt: {[Op.gte]: date}}
                    ]
                }
            })
            return res.status(200).json(Result.success(posts))
        } catch (e) {
            debug('getTrash error by:', e.message)
            return res.status(200).json(Result.error())
        }
    }
]
// 删除文章
/* 只能删除在回收站的文章 */
// 删除文章的同时顺便删除 过期的文章
const del = [
    sanitizeId,
    checkId,
    utils.validationResult,
    async function (req, res) {
        let {id} = req.body
        try {

            let date = new Date()
            date.setDate(date.getDate() - 30)
            debug(`彻底删除文章 ids = [${id}],并且清除时间{${date}} 之前删除的文章`)
            let post = await postDao.find({
                paranoid: false,
                where: {
                    id: id,
                    [Op.or]: [
                        {deleteAt: {[Op.not]: null}},
                        {deleteAt: {[Op.gte]: date}}
                    ]
                }
            })
            if (post === null) {
                return res.status(200).json(Result.info('失败，未提交正确的文章id'))
            }
            // todo 有bug ！！！
            await postDao.destroy({
                paranoid: false,
                force: true,
                where: {
                    [Op.or]: [
                        {deleteAt: id},
                        {deleteAt: {[Op.lte]: date}}
                    ]

                }
            })
            return res.status(200).json(Result.success())
        } catch (e) {
            debug('del post error by:', e.message)
            return res.status(200).json(Result.error())
        }
    }
]


// 创建文章
router.route('/new_post').post(newPost)
// 更新文章
router.route('/save').post(save)
router.route('/release').post(release)
router.route('/trash').post(moverTrash).get(getTrash)
router.route('/del').post(del)

module.exports = router
