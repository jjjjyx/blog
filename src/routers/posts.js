'use strict'

const express = require('express')

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
                post.post_status = Enum.PostStatusEnum.DRAFT
                break
            case Enum.PostStatusEnum.PUBLISH:
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
            return res.status(200).json(Result.success(result.toJSON()))
        } catch (e) {
            debug('newPost error by:', e.message)
            return res.status(200).json(Result.error())
        }

    }
]
// 必须参数 文章id
// 文章的分类， 没提交不给过，默认得放到未分类
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
const release = [
    sanitizeTitle,
    sanitizeId,
    checkTitle,
    checkId,
    checkContent,
    checkPostName,
    checkExcerpt,
    utils.validationResult,
    async function (req, res) {
        let {post_title, id, post_content, post_name, excerpt} = req.body
        try {
            let post = await postDao.findById(id)
            if (post === null)
                return res.status(200).json(Result.info('保存失败，未提交正确的文章id'))
            // 检查 post_name 格式， post_name 只能包含字母数组，下划线 连字符串，长度在60 之间
            if (!postNameReg.test(post_name)) {
                post_name = undefined
            }
            // 修改post 状态
            let values
            post.post_title = post_title
            post.post_content = post_content
            post.excerpt = excerpt
            post.post_name = post_name || post.id
            post.post_status = Enum.PostStatusEnum.PUBLISH

            // todo 分类 ， 标签 ，... 等

            await post.save()

            // 创建版本
            values = post.toJSON()
            values.post_name = `${id}-revision-v1`
            values.post_status = Enum.PostStatusEnum.INHERIT
            values.post_type = 'revision'
            values.id = undefined
            await postDao.create(values)

            return res.status(200).json(Result.success())
        } catch (e) {
            console.log(e)
            debug('release post error by:', e.message)
            return res.status(200).json(Result.error())
        }
    }
]

const moverTrash = [
    sanitizeId,
    checkId,
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
            // 删除文章
            debug(`del post id = [${id}]`)
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
