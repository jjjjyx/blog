'use strict'

const express = require('express')
const _ = require('lodash')
const router = express.Router()
const debug = require('debug')('app:routers:api.posts')
const {body, param} = require('express-validator/check')
const {sanitizeBody, sanitizeParam} = require('express-validator/filter')
const utils = require('../utils')
const Result = require('../common/resultUtils')
const {Enum} = require('../common/enum')

const {termDao,userDao, postDao, postMetaDao, sequelize, Sequelize} = require('../models')
const Op = sequelize.Op

// id
const sanitizeId = sanitizeBody('id').toInt()
const checkId = body('id').exists().isInt().withMessage('请提交正确的文章ID')

const sanitizeCategoryId = sanitizeBody('category_id').toInt()
const checkCategoryId = body('category_id').exists().isInt().withMessage('请提交正确的分类ID')
// todo 数组暂时无法使用express-validator 做检查， 单独提交一个值的时候会错误
// const sanitizeTagsId = sanitizeBody('tags_id').toArray()
// const checkTagsId = body('tags_id').exists().isArray().withMessage('请提交正确的标签ID')

// 蛋疼提交为数组 这个不执行
// const sanitizeNewTagsName = sanitizeBody('new_tag*').customSanitizer((value)=>{/* console.log(value)*/debug(`sanitizeNewTagsName v = ${value}`)return value})
// const checkNewTagsName = body('new_tag').exists().withMessage('请提交新建的标签')

// 标题
const sanitizeTitle = sanitizeBody('post_title').escape().trim()
const checkTitle = body('post_title').exists().isString().isLength({
    min: 0,
    max: 255
}).withMessage('请输入一个有效的标题，有效的标题长度在1~255')

// const sanitizeContent = sanitizeBody('sanitizeContent')
const checkContent = body('post_content').exists().isString().isLength({min: 0}).withMessage('请提交文章内容')
// 文章别名 必须提交 但是不满足格式不会报错而是启用id
const postNameReg = /^[_a-zA-Z0-9\-]{1,60}$/
const sanitizePostName = sanitizeBody('post_name')
    .customSanitizer((value)=>{
        debug(`sanitizePostName v = ${value}`)
        return postNameReg.test(value) ? value : undefined
    })
// const checkPostName = body('post_name').exists().isString().isLength({min: 0}).withMessage('请提交文章')
// 长度在3 - 30
const checkPostPass = body('post_password').custom((value) => {
    // 如果有提交 则验证
    debug(`checkPostPass v = ${value}`)
    return value ? value.length >=3 && value.length < 30 : true
})
// 摘录
const checkExcerpt = body('post_excerpt').exists().isString().isLength({min: 0}).withMessage('请提交文章摘录')

// 允许提交的文章状态
const allowPostStatus = [
    Enum.PostStatusEnum.PENDING,
    Enum.PostStatusEnum.PRIVATE,
    Enum.PostStatusEnum.PUBLISH,
    Enum.PostStatusEnum.DRAFT
]
// 发布的文章状态
const sanitizeReleasePostStatus = sanitizeBody('post_status').customSanitizer((value) => {
    debug(`sanitizeReleasePostStatus v = ${value}`)
    if (allowPostStatus.indexOf(value) === -1) {
        return Enum.PostStatusEnum.PUBLISH
    } else {
        return value
    }
})
const sanitizeAuthor= sanitizeBody('post_author').toInt()
const checkAuthor = body('post_author')
    .exists().withMessage('请提交作者')
    .isInt().withMessage("文章作者不合法")
    .custom((value, { req })=>{
        let {id} = req.user
        if (id === value) {
            return true
        } else {
            return userDao.findById(value, {attributes: {exclude: ['user_pass']}}).then((u)=>{
                if (u === null) return Promise.reject('用户不存在')
                req._post_author = u
            })
        }
    })
// const sanitizeSticky
const sanitizePostDate = sanitizeBody('post_date').toDate()
const sanitizeSticky = sanitizeBody('sticky').toBoolean()
// 允许提交的文章状态
const allowStatus = [
    Enum.StatusEnum.OPEN,
    Enum.StatusEnum.CLOSE
]
const sanitizeCommentStatus = sanitizeBody('comment_status').customSanitizer((value) => {
    debug(`sanitizeCommentStatus v = ${value}`)
    if (allowStatus.indexOf(value) === -1) {
        return Enum.PostStatusEnum.OPEN
    } else {
        return value
    }
})

const TagsLength = 16
const tagToString = t =>`${t.name}#${t.term_id}`
const createTags = async function (req, res, post, dealWithCategory) {
    req.sanitizeBody('new_tag').toArray()
    req.sanitizeBody('tags_id').toArray()
    // req.sanitizeBody('category_id').toInt()
    try {
        let {new_tag, tags_id, category_id} = req.body
        new_tag = new_tag || []
        tags_id = tags_id || []

        // 验证分类是否存在
        let category = await termDao.findById(category_id || SITE.defaultCategoryId, {attributes: ['term_id','name']})
        if (category === null) {
            debug(`createTags 提交了未定义的分类id = ${category_id}，自动修正为默认分类 ${SITE.defaultCategoryId}`)
            category_id = SITE.defaultCategoryId * 1
            category = SITE.defaultTerm
        }


        // 验证new_tag 的名字
        // /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/
        // 包含有错误的tag 驳回请求 因为这个名字会在前端验证，能提交错误的不是什么好请求
        let testReg = new_tag.every((tag)=>utils.termReg.test(tag))
        if (!testReg) {
            return Result.info('错误的标签名称')
        }

        // 验证tags_id
        // 如果tags_id 不存在则忽略
        let tags = await termDao.findAll({
            where:{
                taxonomy: Enum.TaxonomyEnum.POST_TAG,
                term_id:{[Op.in]: tags_id}
            }
        })
        debug(`createTags 提交了标签ID个数 = ${tags_id.length} 个，其中 [${tags.map(tagToString)}] 有效`)
        // 判断tags 的个数 个数的判断在创建标签之前
        if (TagsLength <= tags.length + new_tag.length) {
            return Result.info('标签太多啦！')
        }

        // 对于新加的 new_tag 则去创建
        // 防止同名是个问题，虽然会在页面中做同名过滤，但是保不齐非法提交
        // 做法查询这些new_tag 是否存在, 存在的删除掉
        let newTags = await termDao.findAll({
            where:{
                taxonomy: Enum.TaxonomyEnum.POST_TAG,
                name:{[Op.in]: new_tag}
            }
        })

        tags = tags.concat(newTags)

        let _newTags =  newTags.map((item)=>item.name)
        debug(`createTags 提交了标签名称：[${new_tag}]，其中[${newTags.map(tagToString)}]是已存在的`)

        let new_tagsValue = _.difference(new_tag, _newTags).map((name)=>({name,  taxonomy: Enum.TaxonomyEnum.POST_TAG, description: '', count: 0, slug: utils.randomChar(6)}))
        // 创建
        // bulkCreate
        if (new_tagsValue.length) {
            debug(`createTags 创建其余未定义的标签：[${new_tagsValue}]`)
            tags = tags.concat(await termDao.bulkCreate(new_tagsValue))
        }
        tags.push(category)
        debug(`createTags 文章${post.id} 更新关系为[${tags.map(tagToString)}]`)

        // post.getTerms().then((termRelationships)=>{
        //     let thatIds = termRelationships.map(tagToString)
        //     debug(`createTags 文章${post.id} 原先对应了 ${termRelationships.length} 个关系 [${thatIds}]`)
        //     tags = _.unionBy(termRelationships, tags, 'term_id')
        //
        //     return post.setTerms(tags)
        // }).catch((e)=>{
        //     console.log(e)
        // })
        return await post.setTerms(tags)
    } catch (e) {
        debug('createTags error by:', e.message)
        return Result.error()
    }
}

/**
 * 更新文章的统一方法
 * @param post
 * @param post_title
 * @param post_content
 * @param post_excerpt
 * @returns {Promise<*>}
 * @private
 */
const _save_update = async function (post, {post_title, post_content, post_excerpt}) {
    post.post_title = post_title
    post.post_content = post_content
    post.post_excerpt = post_excerpt
    return await post.save()
}
/**
 * 更新meta 的统一方法
 * @param id
 * @param key
 * @param value
 * @private
 */
let _save_postMeta = function (id, key, value) {
     return postMetaDao.findOrCreate({
        where: {
            post_id: id,
            meta_key: key,
        },
        defaults: {
            meta_value: value
        }
    }).spread((meta, created) => {
        if (!created) {
            meta.meta_value = value;
            return meta.save()
        }
        return true
    })
}
/**
 * 保存文章, 仅保存标题，内容，摘录，标签
 *
 * 如果文章是发布状态
 * 标签的保存放入meta 中，因为标签是关联到文章的 保存的文章可能只是一个版本记录，但是标签是会更新到发布中文章上的
 * 草稿状态就放入实际的对应关系表中
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
        let {post_title, id, post_content, post_excerpt} = req.body
        try {
            // 保存的时候 如果文章当前状态是 auto_draft 则更新状态为草稿
            let post = await postDao.findById(id)
            if (post === null) {
                return res.status(200).json(Result.info('保存失败，未提交正确的文章id'))
            }

            // 提交id 只会有3种状态 auto-draft publish draft

            switch (post.post_status) {
            case Enum.PostStatusEnum.AUTO_DRAFT:
                debug(`修改文章 = ${id} 状态为：${Enum.PostStatusEnum.DRAFT}`)
                post.post_status = Enum.PostStatusEnum.DRAFT
                post.post_name = id
                debug(`修改文章 = ${id} 分类为默认分类：${SITE.defaultTerm.name}#${SITE.defaultTerm.term_id}`)
                await post.setTerms([SITE.defaultTerm])
            case Enum.PostStatusEnum.DRAFT:
                debug(`保存的文章 = ${id} 当前状态为：${post.post_status}`)
                // 保存文章的标签信息
                let createTagsResult = await createTags(req, res, post, false)
                if (createTagsResult instanceof Result) {
                    return res.status(200).json(createTagsResult)
                }
                // let values = {post_title, post_content, post_excerpt, post_status: post.post_status}
                debug(`文章 = ${id} 更新草稿内容！`)
                return res.status(200).json(Result.success(await _save_update(post, req.body)))
                break
            case Enum.PostStatusEnum.PRIVATE:
                // 私密的文章需要验证是否是本人创建的
                let user = req.user
                if (user.id !== post.post_author) {
                    return res.status(200).json(Result.info('保存失败，文章私密，您无权修改'))
                }
            case Enum.PostStatusEnum.PUBLISH:
            case Enum.PostStatusEnum.PENDING:
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
                    debug(`文章 = ${id} 不存在自动存档，根据提交自动创建存档`)
                    let values = post.toJSON()
                    values.id = undefined
                    values.post_name = `${id}-autosave-v1`
                    values.post_type = 'revision'
                    values.post_status = Enum.PostStatusEnum.INHERIT
                    values.post_title = post_title
                    values.post_content = post_content
                    values.post_excerpt = post_excerpt
                    autoSavePost = await postDao.create(values)
                } else {
                    debug(`文章 = ${id} 更新存档内容！`)
                    await _save_update(autoSavePost, req.body)
                }

                // 保存的是当前提交的版本，所以不是从就文章中拷贝
                // 保存文章的标签信息到 meta 中 不创建 term
                // 保存文章的分类信息
                req.sanitizeBody('new_tag').toArray()
                req.sanitizeBody('tags_id').toArray()
                let {new_tag, tags_id, category_id} = req.body
                new_tag = new_tag || []
                tags_id = tags_id || []

                let testReg = new_tag.every((tag) => utils.termReg.test(tag))
                if (!testReg) {
                    return res.status(200).json(Result.info('错误的标签名称'))
                }

                // tags_id  转换成名称 meta 中不保存id
                let tags = await termDao.findAll({
                    attributes: ['name'],
                    where: {
                        taxonomy: Enum.TaxonomyEnum.POST_TAG,
                        term_id: {[Op.in]: tags_id}
                    }
                }).map((item) => item.name)

                // 判断tags 的个数 个数的判断在创建标签之前
                new_tag = new_tag.concat(tags)
                if (TagsLength <= new_tag.length) {
                    return res.status(200).json(Result.info('标签太多啦!'))
                }

                let category = await termDao.findById(category_id)
                if (category === null) {
                    debug(`save 自动存档保存了一个错误的id = ${category_id}，自动修正为默认分类 ${SITE.defaultCategoryId}`)
                    category = SITE.defaultTerm
                }

                Promise.all([
                    _save_postMeta(autoSavePost.id, 'tags', JSON.stringify(new_tag)),
                    _save_postMeta(autoSavePost.id, 'category', JSON.stringify(category.term_id))
                ]).then(()=>{
                    debug(`save 文章存档 = [${autoSavePost.id}#${autoSavePost.post_name}]，保存分类标签记录!`)
                })
                return res.status(200).json(Result.success(autoSavePost))
                break
            default:
                return res.status(200).json(Result.info('保存失败，未提交正确的文章id'))
            }
        } catch (e) {
            console.log(e)
            debug('save error by:', e.message)
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
// 文章状态
//
// 评论状态
// 可选参数
// 作者
// 封面图
//

// 更新 ，发布接口
// 更新或发布将创建一个版本记录

const release = [
    sanitizeTitle,
    sanitizeId,
    sanitizeCategoryId,
    sanitizePostName,
    sanitizeReleasePostStatus,
    sanitizeAuthor,
    sanitizePostDate,
    sanitizeCommentStatus,
    sanitizeSticky,
    checkTitle,
    checkId,
    checkContent,
    checkExcerpt,
    checkPostPass,
    // checkPostName,
    // checkCategoryId,
    checkAuthor,
    // checkTagsId,
    utils.validationResult,
    async function (req, res) {
        // todo 评论状态
        let {
            id,
            post_title,
            post_content,
            post_name,
            post_excerpt,
            post_date,
            post_author,
            render_value,
            sticky,
            post_status,
            post_password,
            comment_status,
            _post_author
        } = req.body

        try {
            let post = await postDao.findById(id)
            if (post === null) {
                return res.status(200).json(Result.info('保存失败，未提交正确的文章id'))
            }
            // 只能对自己的文章进行转私密, 加密码 在这里进行判断下
            let user = req.user
            if (post_author !== user.id && (post_status === Enum.PostStatusEnum.PRIVATE || post_password)) {
                return res.status(200).json(Result.info('您不可以对别人的文章加密'))
            }

            debug(`release 提交 body = ${JSON.stringify(req.body)}`)
            // return res.status(200).json('null')

            let createTagsResult = await createTags(req, res, post, true)
            if (createTagsResult instanceof Result) {
                return res.status(200).json(createTagsResult)
            }

            // 记录文章旧状态
            // # 版本只对做 内容，标题，摘录信息，密码，评论状态敏感
            let oldValues = post.toJSON()
            delete oldValues.post_status
            delete oldValues.post_date
            delete oldValues.post_name
            delete oldValues.updatedAt

            post.post_title = post_title
            post.post_content = post_content
            post.post_name = post_name
            post.post_excerpt = post_excerpt
            post.post_date = post_date || new Date()
            // post.post_author = // 最初的创建者不能修改的 提交的文章作者只会存在版本记录中
            // sticky
            _save_postMeta(id, 'sticky', sticky)
            _save_postMeta(id, 'render', render_value)
            post.post_status = post_status
            post.post_password = post_password
            post.comment_status = comment_status

            await post.save()
            let newValues = post.toJSON()
            delete newValues.post_status
            delete newValues.post_date
            delete newValues.post_name
            delete newValues.updatedAt
            // 检查内容是否修改了，没有修改则不创建版本
            // debug(`是否修改了文章 = ${id}, result = ${result}`)
            let isModify = _.isEqual(newValues, oldValues)
            console.log('newValues: =', newValues)
            console.log('oldValues: =', oldValues)
            debug(`是否修改了文章 isModify = ${!isModify}`)
            if (!isModify) {
                // 创建版本
                let values = newValues
                values.post_name = `${id}-revision-v1`
                values.post_status = Enum.PostStatusEnum.INHERIT
                values.post_type = 'revision'
                values.post_date = post.post_date
                values.id = undefined
                postDao.create(values).then((rp)=>{
                    _save_postMeta(rp.id, 'author', _post_author || req.user)
                    // _save_postMeta(rp.id, 'author_user_name', post_author)
                })
            }
            return res.status(200).json(Result.success())
        } catch (e) {
            console.log(e)
            debug('release post error by:', e.message)
            return res.status(200).json(Result.error())
        }
    }
]

const moverTrash = [
    // body('ids').exists().isArray().withMessage('请提交正确的文章ID列表'),
    utils.validationResult,
    async function (req, res) {
        try {
            req.sanitizeBody('ids').toArray()
            let {ids} = req.body

            // 只能移动发布的文章 跟草稿对象， 以及当前用户的私密文章
            let result = await postDao.destroy({
                where: {
                    id: ids,
                    [Op.or]: [
                        {
                            post_status: Enum.PostStatusEnum.PRIVATE,
                            post_author: req.user.id
                        },
                        {
                            post_status: [
                                Enum.PostStatusEnum.PUBLISH, Enum.PostStatusEnum.DRAFT
                            ]
                        }
                    ]
                }
            })
            debug(`mover trash ids = [${ids}], 其中${result} 个id 有效, 已成功丢弃至回收站`)
            // 删除文章
            return res.status(200).json(Result.success(result))
        } catch (e) {
            debug('mover trash error by:', e.message)
            return res.status(200).json(Result.error())
        }
    }
]

// 删除文章
/* 只能删除在回收站的文章 */
// 删除文章的同时顺便删除 过期的文章
// todo 删除多余的空白自动草稿
const del = [
    utils.validationResult,
    async function (req, res) {
        req.sanitizeBody('ids').toArray()
        let {ids} = req.body
        try {
            let date = new Date()
            date.setDate(date.getDate() - 30)
            // 删除文章时需要清除掉关联关系

            await termRelationshipsDao.destroy({
                paranoid: false,
                force: true,
                where: {
                    object_id: ids
                }
            })
            let result = await postDao.destroy({
                paranoid: false,
                force: true,
                where: {
                    id: ids,
                    [Op.or]: [
                        {deleteAt: {[Op.not]: null}},
                        {deleteAt: {[Op.gte]: date}}
                    ]
                }
            })
            debug(`彻底删除文章 ids = [${ids}],并且清除时间{${utils.formatDate(date)}} 之前删除的文章, 共计删除文章: ${result} 篇`)
            return res.status(200).json(Result.success(result))
        } catch (e) {
            debug('del post error by:', e.message)
            return res.status(200).json(Result.error())
        }
    }
]

const getAllPost = [
    async function (req, res) {
        try {
            let posts = await postDao.findAll({
                where: {
                    [Op.or]: [
                        {
                            post_status: Enum.PostStatusEnum.PRIVATE,
                            post_author: req.user.id
                        },
                        {
                            post_status: [
                                Enum.PostStatusEnum.PUBLISH, Enum.PostStatusEnum.DRAFT
                            ]
                        }
                    ]
                },
                include: [
                    {
                        // as: 'post_author',
                        model: userDao,
                        attributes: {
                            exclude: ['user_pass']
                        }
                    },
                    {
                        model: termDao,
                        attributes: ['icon', 'description', 'name', 'slug', 'taxonomy', 'term_id']
                    }
                ]

            })
            debug(`获取全部文章，包含有[发布,草稿],共计：${posts.length} 篇`)
            return res.status(200).json(Result.success(posts))
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
                        {deleteAt: {[Op.gte]: date}},
                    ],
                    // [Op.and] :{
                    [Op.or]: [
                        {
                            post_status: Enum.PostStatusEnum.PRIVATE,
                            post_author: req.user.id
                        },
                        {
                            post_status: [
                                Enum.PostStatusEnum.PUBLISH, Enum.PostStatusEnum.DRAFT
                            ]
                        }
                    ]
                    // }
                }
            })
            return res.status(200).json(Result.success(posts))
        } catch (e) {
            debug('getTrash error by:', e.message)
            return res.status(200).json(Result.error())
        }
    }
]
// 还原回收站文章
const revert = [
    async function (req, res) {
        req.sanitizeBody('ids').toArray()
        let {ids} = req.body
        try {
            let result = await postDao.update({
                deleteAt: null
            },{
                paranoid: false,
                where: {
                    id: ids,
                    [Op.or]: [
                        {deleteAt: {[Op.not]: null}}
                    ]
                }
            })
            debug(`还原文章 ids = [${ids}], 共计还原文章: ${result} 篇`)
            return res.status(200).json(Result.success(result))
        } catch (e) {
            debug('del post error by:', e.message)
            return res.status(200).json(Result.error())
        }
    }
]
const postInfo = [
    sanitizeParam('id').toInt(),
    param('id').isInt().exists().withMessage('错误的id'),
    utils.validationResult,
    async function (req, res) {
        console.log(req.user)
        let {id} = req.params
        try {
            let result = await postDao.findOne({
                // attributes: {
                //     exclude: ['']
                // },
                where: {
                    id,
                    [Op.or]: [
                        {
                            post_status: Enum.PostStatusEnum.PRIVATE,
                            post_author: req.user.id
                        },
                        {
                            post_status: [Enum.PostStatusEnum.PUBLISH, Enum.PostStatusEnum.DRAFT, Enum.PostStatusEnum.AUTO_DRAFT]
                        }
                    ]
                },
                include: [
                    {model: postMetaDao, as: 'metas'},
                    {model: termDao},
                    {model: userDao, attributes: {exclude: ['user_pass']}}
                ]
            })

            if (result !== null) {
                // 调取文章的历史版本
                // 草稿类型调取不检查
                // if (result.post_status !== Enum.PostStatusEnum.DRAFT) {
                let revision = await postDao.findAll({
                    attributes: ['id', 'createdAt', ['post_name', 'type'], 'updatedAt'],
                    where: {
                        post_type: 'revision',
                        post_status: Enum.PostStatusEnum.INHERIT,
                        post_name: [`${id}-autosave-v1`, `${id}-revision-v1`,]
                    },
                    include: [
                        {model: postMetaDao, as: 'metas'},
                        {model: userDao, attributes: {exclude: ['user_pass']}}
                    ],
                    order: [['updatedAt', 'DESC']]
                })
                result.dataValues.revision = revision
                return res.status(200).json(Result.success(result))
            }
            return res.status(200).json(Result.info('错误的id'))
        } catch (e) {
            debug('post getContent error by:', e.message)
            return res.status(200).json(Result.error())
        }
    }
]

// const test = [
//     function (req, res, next){
//         console.log(req.body)
//         req.sanitizeBody('ids').toArray()
//         console.log(req.body)
//         next()
//     },
//     utils.validationResult,
//     function (req, res) {
//         // console.log(req)
//         console.log(req.body)
//         return res.send("aaaa")
//     }
// ]

router.route('/').get(getAllPost)
// 创建文章
router.route('/new_post').post(newPost)
// 更新文章
router.route('/save').post(save)
router.route('/release').post(release)
router.route('/revert').post(revert)
router.route('/del').post(del)
router.route('/trash').get(getTrash).post(moverTrash)
router.route('/:id').get(postInfo)
// router.route('/test').post(test)

module.exports = router
