'use strict'

const express = require('express')
const marked = require('marked')
const intersectionBy = require('lodash/intersectionBy')
const difference = require('lodash/difference')
const isEqual = require('lodash/isEqual')
const { body, param } = require('express-validator/check')
const { sanitizeBody, sanitizeParam } = require('express-validator/filter')
// const debug = require('debug')('app:routers:api.posts')

const utils = require('../../utils')
const log = require('../../common/manageLog')('api.posts')
const Result = require('../../common/result')
const common = require('../../common')

const { termDao, userDao, postDao, postMetaDao, sequelize } = require('../../models/index')
const { term_relationships: termRelationshipsDao } = sequelize.models
const router = express.Router()
const Op = sequelize.Op

const trashSaveDay = 30
// 文章别名 必须提交 但是不满足格式不会报错而是启用id
const postNameReg = common.REGS.POST_NAME_REG
const termNameReg = common.REGS.TERM_NAME_REG
// 允许提交的文章状态
const allowPostStatus = [
    common.ENUMERATE.PostStatusEnum.PENDING,
    // common.ENUMERATE.PostStatusEnum.PRIVATE, // 禁用私密
    common.ENUMERATE.PostStatusEnum.PUBLISH,
    common.ENUMERATE.PostStatusEnum.DRAFT
]
// 允许提交的评论状态
const allowStatus = [
    common.ENUMERATE.StatusEnum.OPEN,
    common.ENUMERATE.StatusEnum.CLOSE
]
const TagsLength = common.CONSTANT.POST_MAX_TAGS_LENGTH
log.trace('Maximum number of articles in the article', TagsLength)
log.trace('allowPostStatus = %s', JSON.stringify(allowPostStatus))
log.trace('postNameReg = %s', postNameReg)
log.trace('termNameReg %s', termNameReg)
log.trace('Recycle Bin save article %s days', trashSaveDay)
// id
const sanitizeId = sanitizeBody('id').toInt()
const checkId = body('id').exists().isInt().withMessage('请提交正确的文章ID')

const sanitizeCategoryId = sanitizeBody('category_id').toInt()

// 标题
const sanitizeTitle = sanitizeBody('post_title').trim()
const checkTitle = body('post_title').exists().isString().isLength({
    min: 0,
    max: 255
}).withMessage('请输入一个有效的标题，有效的标题长度在1~255')

// const sanitizeContent = sanitizeBody('sanitizeContent')
const checkContent = body('post_content')
    .exists()
    .isString()
    .isLength({ min: 0 })
    .withMessage('请提交文章内容')

const sanitizePostName = sanitizeBody('post_name').customSanitizer((value) => {
    log.trace(`sanitizePostName v = ${value}`)
    return postNameReg.test(value) ? value : undefined
})
// const checkPostName = body('post_name').exists().isString().isLength({min: 0}).withMessage('请提交文章')
// 长度在3 - 30
const checkPostPass = body('post_password').custom((value) => {
    // 如果有提交 则验证
    log.trace(`checkPostPass v = ${value}`)
    return value ? value.length >= 3 && value.length < 30 : true
})
// 摘录
const checkExcerpt = body('post_excerpt')
    .exists()
    .isString()
    .isLength({ min: 0 })
    .withMessage('请提交文章摘录')

// 发布的文章状态
const sanitizeReleasePostStatus = sanitizeBody('post_status')
    .customSanitizer((value) => {
        log.trace(`sanitizeReleasePostStatus v = ${value}`)
        if (allowPostStatus.indexOf(value) === -1) {
            return common.ENUMERATE.PostStatusEnum.PUBLISH
        } else {
            return value
        }
    })
const sanitizeAuthor = sanitizeBody('post_author').toInt()
const checkAuthor = body('post_author')
    .exists()
    .withMessage('请提交作者')
    .isInt()
    .withMessage('文章作者不合法')
    .custom((value, { req }) => {
        let { id } = req.user
        if (id === value) {
            return true
        } else {
            log.trace('Verify article author = %s', value)
            return userDao.findByPk(value, { attributes: { exclude: ['user_pass'] } })
                .then((u) => {
                    if (u === null) {
                        log.trace('Verify the author of the article, the author = %s does not exist', value)
                        return Promise.reject(new Error('用户不存在'))
                    }
                    req.postAuthor = u
                })
        }
    })
const sanitizePostDate = sanitizeBody('post_date').toDate()
const sanitizeSticky = sanitizeBody('sticky').toBoolean()

const sanitizeCommentStatus = sanitizeBody('comment_status')
    .customSanitizer((value) => {
        log.trace(`sanitizeCommentStatus v = ${value}`)
        if (allowStatus.indexOf(value) === -1) {
            return common.ENUMERATE.PostStatusEnum.OPEN
        } else {
            return value
        }
    })

const termToString = common.CONSTANT.TERM_TO_STRING

/**
 * 根据提交 创建标签
 * @param newTag
 * @param tagsId
 * @param req
 * @returns {Promise<Model[]>}
 * @private
 */
const $createTerms = async function ({ new_tag: newTag, tags_id: tagsId }, req) {
    log.trace('createTerms before new_tag = %s, tags_id = %s', newTag, tagsId)
    newTag = newTag || []
    tagsId = tagsId || []

    // 验证new_tag 的名字
    // /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/
    // 包含有错误的tag 驳回请求 因为这个名字会在前端验证，能提交错误的不是什么好请求
    let testReg = newTag.every((tag) => termNameReg.test(tag))
    log.trace('_createTerms testReg = %s', testReg)
    if (!testReg) {
        log.trace('_createTerms fail: Wrong tag name')
        throw new Error('错误的标签名称')
    }

    // 验证tags_id
    // 如果tags_id 不存在则忽略
    let tags = await termDao.findAll({
        where: {
            taxonomy: common.ENUMERATE.TaxonomyEnum.POST_TAG,
            id: { [Op.in]: tagsId }
        }
    })
    log.trace('_createTerms Number of submitted tags = %d, Where [%s] is valid, Total number of tags = %d', tagsId.length, tags.map(termToString), tags.length + newTag.length)
    // 判断tags 的个数 个数的判断在创建标签之前
    if (TagsLength <= tags.length + newTag.length) {
        log.trace('_createTerms fail: Too many tags!, maxTags = %d , currTags = %s', TagsLength, tags.length + newTag.length)
        throw new Error('标签太多啦！')
    }

    // 对于新加的 new_tag 则去创建
    // 防止同名是个问题，虽然会在页面中做同名过滤，但是保不齐非法提交
    // 做法查询这些new_tag 是否存在, 存在的删除掉
    let newTags = await termDao.findAll({
        where: {
            taxonomy: common.ENUMERATE.TaxonomyEnum.POST_TAG,
            name: { [Op.in]: newTag }
        }
    })

    tags = tags.concat(newTags)

    log.trace(`_createTerms Submitted tag name：[%s]，Where [%s] is already present`, newTag, newTags.map(termToString))

    let _newTags = newTags.map((item) => item.name)
    let newTagsValue = difference(newTag, _newTags).map((name) => ({
        name,
        taxonomy: common.ENUMERATE.TaxonomyEnum.POST_TAG,
        description: '',
        count: 0,
        slug: utils.randomChar(6)
    }))
    // 创建
    // bulkCreate
    if (newTagsValue.length) {
        log.trace('_createTerms Create the remaining undefined tags：[%s]', newTagsValue)
        let results = await termDao.bulkCreate(newTagsValue)
        log.creates(req, results, common.ENUMERATE.relatedTypeEnum.post_tag)
        // tags = tags.concat(results)
        tags.push(...results)
    }
    log.trace('createTerms after')
    // tags.push(category)
    return tags
}
/**
 * 更新文章的 Terms
 * new_tag 新增的标签
 * tags_id 标签id
 * category_id 分类id
 * @param req
 * @param res
 * @param post
 * @returns {Promise<void>}
 * @private
 */
const $updatePostTerms = async function (req, res, post) {
    req.sanitizeBody('new_tag').toArray()
    req.sanitizeBody('tags_id').toArray()

    let { category_id: categoryId } = req.body
    // 验证分类是否存在 , 分类不存在是修正未默认分类
    let category = await termDao.findByPk(categoryId || SITE.defaultCategoryId)
    if (category === null) {
        log.trace(`_updatePostTerms Error article category id = ${categoryId}, Fix to default category = ${SITE.defaultCategoryId}`)
        category = SITE.defaultTerm
    }
    // 标签不存在去创建标签
    let tags = await $createTerms(req.body, req)

    tags.push(category)

    let postTerms = await post.getTerms()
    let oldObj = postTerms

    let d = intersectionBy(postTerms, tags, 'id').length

    // console.log('post.terms', await post.getTerms())
    if (d !== postTerms.lenght) {
        log.trace('_updatePostTerms Article #%d modified, updated tag and category as [%s]', post.id, tags.map(termToString))
        await post.setTerms(tags)
        await postDao.update({ updatedAt: new Date() }, { where: { id: post.id } })
        let newObj = tags
        log.trace('Update article tags, modify article time')

        log.updatePostTerm(req, post, oldObj, newObj)
    }
}

/**
 * 更新文章的统一方法
 * @param post
 * @param postTitle
 * @param postContent
 * @param postExcerpt
 * @param req
 * @returns {Promise<*>}
 * @private
 */
const $saveUpdate = function (post, { post_title: postTitle, post_content: postContent, post_excerpt: postExcerpt }, req) {
    let oldObj = {
        post_title: post.post_title,
        post_content: post.post_content,
        post_excerpt: post.post_excerpt
    }
    post.post_title = postTitle
    post.post_content = postContent
    post.post_excerpt = postExcerpt
    let newObj = {
        post_title: postTitle,
        post_content: postContent,
        post_excerpt: postExcerpt
    }
    // console.log(post)
    // 使用save 方式 如果仅保存了标签那么修改的时间戳不会被更新
    // 文章的更新内容过多需要diff text
    log.updatePost(req, post, oldObj, newObj)
    return post.save()
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
    common.validationResult,
    async function (req, res) {
        let { post_title: postTitle, id, post_content: postContent, post_excerpt: postExcerpt } = req.body
        log.trace('Before executing the save article method，the parameters post_title = %s, id = %s', postTitle, id)
        try {
            // 保存的时候 如果文章当前状态是 auto_draft 则更新状态为草稿
            let post = await postDao.findByPk(id)
            if (post === null) {
                log.trace('Failed to save the article, did not submit the correct article id!!')
                return res.status(200).json(Result.info('保存失败，未提交正确的文章id'))
            }

            // 提交id 只会有3种状态 auto-draft publish draft
            log.trace('保存文章#%d post_status = %s', post.id, post.post_status)
            switch (post.post_status) {
                case common.ENUMERATE.PostStatusEnum.AUTO_DRAFT:
                    post.post_status = common.ENUMERATE.PostStatusEnum.DRAFT
                    post.post_name = id
                    post.guid = utils.randomChar(16)
                    log.trace(`修改文章 #%d 状态为：%s , guid = %s`, id, common.ENUMERATE.PostStatusEnum.DRAFT, post.guid)
                    // await post.setTerms([SITE.defaultTerm])
                    // eslint-disable-next-line no-fallthrough
                case common.ENUMERATE.PostStatusEnum.DRAFT:
                    // 保存文章的标签信息
                    try {
                        await $updatePostTerms(req, res, post)
                    } catch (e) {
                        log.error('Save article failed, save article tag, article category error by', e)
                        return res.status(200).json(Result.info(e.message))
                    }
                    // let values = {post_title, post_content, post_excerpt, post_status: post.post_status}
                    log.trace('Article %d updates draft content!', post.id)
                    let result = await $saveUpdate(post, req.body, req)
                    return res.status(200).json(Result.success(result))
                case common.ENUMERATE.PostStatusEnum.PRIVATE:
                    // 私密的文章需要验证是否是本人创建的
                    // 禁用私密功能
                    // let user = req.user
                    // if (user.id !== post.post_author) {
                    //     return res.status(200).json(Result.info('保存失败，文章私密，您无权修改'))
                    // }
                    // eslint-disable-next-line no-fallthrough
                case common.ENUMERATE.PostStatusEnum.PUBLISH:
                case common.ENUMERATE.PostStatusEnum.PENDING:
                    // 如果是发布状态
                    // 则去获取发布状态文章的自动草稿
                    // 如果获取为空，则创建一个: ${id}--autosave-v1
                    let autoSavePost = await postDao.findOne({
                        where: {
                            post_name: `${id}-autosave-v1`,
                            post_status: common.ENUMERATE.PostStatusEnum.INHERIT,
                            post_type: 'revision'
                        }
                    })
                    if (autoSavePost === null) {
                        log.trace('Article %d does not exist for automatic archiving, creating an archive automatically', id)
                        let values = post.toJSON()
                        values.id = undefined
                        values.post_name = `${id}-autosave-v1`
                        values.post_type = 'revision'
                        values.post_status = common.ENUMERATE.PostStatusEnum.INHERIT
                        values.post_title = postTitle
                        values.post_content = postContent
                        values.post_excerpt = postExcerpt
                        values.createdAt = null
                        autoSavePost = await postDao.create(values)
                        log.create(req, autoSavePost, common.ENUMERATE.relatedTypeEnum.revision)
                    } else {
                        log.trace(`Article %d updates the archive content!`, id)
                        await $saveUpdate(autoSavePost, req.body, req)
                    }

                    // 保存的是当前提交的版本，所以不是从就文章中拷贝
                    // 保存文章的标签信息到 meta 中 不创建 term
                    // 保存文章的分类信息

                    req.sanitizeBody('new_tag').toArray()
                    req.sanitizeBody('tags_id').toArray()
                    let { category_id: categoryid } = req.body

                    let category = await termDao.findByPk(categoryid)
                    if (category === null) {
                        // Submitted an undefined category id = ${category_id}， Automatically corrected to default category
                        log.trace(`save Error article category id = ${categoryid}, Fix to default category ${SITE.defaultCategoryId}`)
                        category = SITE.defaultTerm
                    }
                    log.trace('保存文章#%d-AutoSave#%d 标签，分类信息到meta ', id, autoSavePost.id)
                    let newTag = await $createTerms(req.body, req)

                    await Promise.all([
                        common.updateOrCreatePostMeta(autoSavePost.id, 'tags', JSON.stringify(newTag.map(item => item.name))),
                        common.updateOrCreatePostMeta(autoSavePost.id, 'category', JSON.stringify(category.id))
                    ])
                    log.trace(`save 文章存档 = [${autoSavePost.id}#${autoSavePost.post_name}]，保存分类标签记录!`)

                    return res.status(200).json(Result.success(autoSavePost))
                default:
                    log.trace('保存失败，错误文章状态')
                    return res.status(200).json(Result.info('保存失败，错误文章状态'))
            }
        } catch (e) {
            log.error('save post error by:', e)
            return res.status(200).json(Result.error())
        }
    }
]

const updateCategory = [
    sanitizeId,
    checkId,
    common.validationResult,
    async function (req, res) {
        let { category_id: categoryId, id } = req.body
        try {
            let post = await postDao.findByPk(id, {
                include: [
                    {
                        model: termDao,
                        attributes: ['icon', 'description', 'name', 'slug', 'taxonomy', 'id']
                    }
                ]
            })

            if (post === null) {
                log.trace('Update article category failed. The correct article id was not submitted.')
                return res.status(200).json(Result.info('更新失败，未提交正确的文章id'))
            }

            let { category: originCategory } = post.getCategoryOrTags()

            if (originCategory.id === categoryId) {
                log.info('The revised article category is the same as the current article category')
                return res.status(200).json(Result.success())
            }

            let category = await termDao.findByPk(categoryId)
            if (category === null) {
                log.debug(`updateCategory Error article category id = ${categoryId}, Fix to default category ${SITE.defaultCategoryId}`)
                category = SITE.defaultTerm
            }

            await termRelationshipsDao.update({
                term_id: category.id
            }, {
                where: {
                    object_id: id,
                    term_id: originCategory.id
                },
                individualHooks: true
            })
            let oldCategory = common.CONSTANT.TERM_TO_STRING(originCategory)
            let newCategory = common.CONSTANT.TERM_TO_STRING(category)
            log.trace('Modify the article category successfully %s => %s', oldCategory, newCategory)
            let oldObj = {
                category: oldCategory
            }
            let newObj = {
                category: newCategory
            }
            log.updatePostTerm(req, post, oldObj, newObj)
            return res.status(200).json(Result.success(category))
        } catch (e) {
            log.error('updateCategory error by:', e)
            return res.status(200).json(Result.error())
        }
    }
]

const newPost = [
    sanitizeTitle,
    checkTitle,
    // body('id').isEmpty().withMessage('test').isInt().withMessage('分类id 不正确'),
    common.validationResult,
    async function (req, res) {
        let { post_title: postTitle } = req.body
        try {
            let result = await postDao.create({
                post_author: req.user.id,
                post_content: '',
                post_title: postTitle,
                post_excerpt: '',
                post_status: common.ENUMERATE.PostStatusEnum.AUTO_DRAFT,
                post_name: '',
                guid: ''
            })
            log.trace('创建新的自动草稿，草稿ID = ', result.id)
            log.create(req, result, common.ENUMERATE.relatedTypeEnum.autoDraft)
            return res.status(200).json(Result.success(result.toJSON()))
        } catch (e) {
            log.error('newPost error by:', e)
            return res.status(200).json(Result.error())
        }
    }
]

const moverTrash = [
    // body('ids').exists().isArray().withMessage('请提交正确的文章ID列表'),
    common.validationResult,
    async function (req, res) {
        try {
            req.sanitizeBody('ids').toArray()
            let { ids } = req.body

            // 只能移动发布的文章 跟草稿对象， 以及当前用户的私密文章
            let result = await postDao.destroy({
                where: {
                    id: ids,
                    post_status: [
                        common.ENUMERATE.PostStatusEnum.PUBLISH, common.ENUMERATE.PostStatusEnum.DRAFT
                    ]
                    // [Op.or]: [ // 禁用私密功能
                    //     {
                    //         post_status: common.ENUMERATE.PostStatusEnum.PRIVATE,
                    //         post_author: req.user.id
                    //     },
                    //     {
                    //         post_status: [
                    //             common.ENUMERATE.PostStatusEnum.PUBLISH, common.ENUMERATE.PostStatusEnum.DRAFT
                    //         ]
                    //     }
                    // ]
                }
            })
            log.trace(`mover trash ids = [${ids}], 其中${result} 个id 有效, 已成功丢弃至回收站`)
            log.trash(req, ids, common.ENUMERATE.relatedTypeEnum.post)
            // 删除文章
            return res.status(200).json(Result.success(result))
        } catch (e) {
            log.error('mover trash error by:', e)
            return res.status(200).json(Result.error())
        }
    }
]

// 删除文章
/* 只能删除在回收站的文章 */
// 删除文章的同时顺便删除 过期的文章
// todo 删除多余的空白自动草稿
const del = [
    common.validationResult,
    async function (req, res) {
        req.sanitizeBody('ids').toArray()
        let { ids } = req.body
        try {
            let date = new Date()
            date.setDate(date.getDate() - trashSaveDay)
            // 删除文章时需要清除掉关联关系
            await termRelationshipsDao.destroy({
                paranoid: false,
                force: true,
                where: {
                    object_id: ids
                }
            })
            let where = {
                id: ids,
                [Op.or]: [
                    { deleteAt: { [Op.not]: null } },
                    { deleteAt: { [Op.gte]: date } }
                ]
            }
            //  删除文章不可以删除别人的私有有文章
            let result = await postDao.destroy({
                paranoid: false,
                force: true,
                where
            })
            log.trace(`彻底删除文章 ids = [${ids}], 并且清除时间{${utils.formatDate(date)}} 之前删除的文章, 共计删除文章: ${result} 篇`)
            log.delete(req, ids, common.ENUMERATE.relatedTypeEnum.post)
            return res.status(200).json(Result.success(result))
        } catch (e) {
            log.error('del post error by:', e)
            return res.status(200).json(Result.error())
        }
    }
]

const getAllPost = [
    async function (req, res) {
        try {
            let posts = await postDao.findAll({
                where: {
                    post_status: [
                        common.ENUMERATE.PostStatusEnum.PUBLISH, common.ENUMERATE.PostStatusEnum.DRAFT
                    ]
                    // [Op.or]: [ // 禁用私密功能
                    //     {
                    //         post_status: common.ENUMERATE.PostStatusEnum.PRIVATE,
                    //         post_author: req.user.id
                    //     },
                    //     {
                    //         post_status: [
                    //             common.ENUMERATE.PostStatusEnum.PUBLISH, common.ENUMERATE.PostStatusEnum.DRAFT
                    //         ]
                    //     }
                    // ]
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
                        attributes: [
                            'icon',
                            'description',
                            'name',
                            'slug',
                            'taxonomy',
                            'id']
                    }
                ]

            })
            log.trace(`获取全部文章，包含有[发布,草稿],共计：${posts.length} 篇`)
            return res.status(200).json(Result.success(posts))
        } catch (e) {
            log.error('getAllPost error by:', e)
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
            date.setDate(date.getDate() - trashSaveDay)
            log.trace(`获取回收站中内容`)
            let posts = await postDao.findAll({
                paranoid: false,
                where: {
                    post_status: [
                        common.ENUMERATE.PostStatusEnum.PUBLISH, common.ENUMERATE.PostStatusEnum.DRAFT
                    ],
                    deleteAt: {
                        [Op.ne]: null,
                        [Op.gte]: date
                    }
                    // [Op.and] :{ // 禁用私密功能
                    //     [Op.or]: [
                    //         {
                    //             post_status: common.ENUMERATE.PostStatusEnum.PRIVATE,
                    //             post_author: req.user.id
                    //         },
                    //         {
                    //             post_status: [
                    //                 common.ENUMERATE.PostStatusEnum.PUBLISH, common.ENUMERATE.PostStatusEnum.DRAFT
                    //             ]
                    //         }
                    //     ]
                    // }
                }
            })
            return res.status(200).json(Result.success(posts))
        } catch (e) {
            log.error('getTrash error by:', e)
            return res.status(200).json(Result.error())
        }
    }
]
// 还原回收站文章
const revert = [
    async function (req, res) {
        req.sanitizeBody('ids').toArray()
        let { ids } = req.body
        try {
            let result = await postDao.update({
                deleteAt: null
            }, {
                paranoid: false,
                where: {
                    id: ids,
                    [Op.or]: [
                        { deleteAt: { [Op.not]: null } }
                    ]
                }
            })
            log.trace(`还原文章 ids = [${ids}], 共计还原文章: ${result} 篇`)
            log.revert(req, ids, common.ENUMERATE.relatedTypeEnum.post)
            return res.status(200).json(Result.success(result))
        } catch (e) {
            log.error('del post error by:', e)
            return res.status(200).json(Result.error())
        }
    }
]
const $getPostInfo = async function (req, res) {
    let id = req.params.id ? req.params.id : req.body.id
    try {
        log.trace('获取文章详细， post = %d', id)
        let result = await postDao.findOne({
            // attributes: {
            //     exclude: ['']
            // },
            where: {
                id,
                post_status: [
                    common.ENUMERATE.PostStatusEnum.PUBLISH,
                    common.ENUMERATE.PostStatusEnum.DRAFT,
                    common.ENUMERATE.PostStatusEnum.AUTO_DRAFT,
                    common.ENUMERATE.PostStatusEnum.PENDING
                ]
                // [Op.or]: [ // 禁用私密功能
                //     {
                //         post_status: common.ENUMERATE.PostStatusEnum.PRIVATE,
                //         post_author: req.user.id
                //     },
                //     {
                //         post_status: [common.ENUMERATE.PostStatusEnum.PUBLISH, common.ENUMERATE.PostStatusEnum.DRAFT, common.ENUMERATE.PostStatusEnum.AUTO_DRAFT]
                //     }
                // ]
            },
            include: [
                { model: postMetaDao, as: 'metas' },
                { model: termDao },
                { model: userDao, attributes: { exclude: ['user_pass'] } }
            ]
        })
        if (result === null) {
            log.info('获取文章详细失败, 错误的id = ', id)
            return res.status(200).json(Result.info('错误的id'))
        }

        // 调取文章的历史版本
        // 草稿类型调取不检查
        // if (result.post_status !== common.ENUMERATE.PostStatusEnum.DRAFT) {
        let revision = await postDao.findAll({
            attributes: [
                'id',
                'createdAt',
                ['post_name', 'type'],
                'updatedAt',
                'post_content',
                'post_title',
                'post_excerpt'],
            where: {
                post_type: 'revision',
                post_status: common.ENUMERATE.PostStatusEnum.INHERIT,
                post_name: [`${id}-autosave-v1`, `${id}-revision-v1`]
            },
            include: [
                { model: postMetaDao, as: 'metas' },
                { model: userDao, attributes: { exclude: ['user_pass'] } }
            ],
            order: [['updatedAt', 'DESC']]
        })
        log.trace('获取文章历史版本， post = %d, 共 %d 个版本', id, revision.length)
        result.dataValues.revision = revision
        return res.status(200).json(Result.success(result))
    } catch (e) {
        log.error('post getContent error by:', e)
        return res.status(200).json(Result.error())
    }
}

const postInfo = [
    sanitizeParam('id').toInt(),
    param('id').isInt().exists().withMessage('错误的id'),
    common.validationResult,
    $getPostInfo
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
    common.validationResult,
    async function (req, res, next) {
        // todo 评论状态
        let {
            id,
            post_title: postTitle,
            post_content: postContent,
            post_name: postName,
            post_excerpt: postExcerpt,
            post_date: postDate,
            render_value: renderValue,
            post_status: postStatus,
            post_password: postPassword,
            comment_status: commentStatus,
            // post_author,
            sticky,
            postAuthor
        } = req.body
        log.trace('release post id = %d post_title = %s', id, postTitle)
        try {
            let post = await postDao.findByPk(id)
            if (post === null) {
                log.info('发布失败，未提交正确的文章id')
                return res.status(200).json(Result.info('发布失败，未提交正确的文章id'))
            }
            // 只能对自己的文章进行转私密, 加密码 在这里进行判断下
            // 禁用私密功能
            // let user = req.user
            // if (post_author !== user.id && (post_status === common.ENUMERATE.PostStatusEnum.PRIVATE || post_password)) {
            //     return res.status(200).json(Result.info('您不可以对别人的文章加密'))
            // }

            // log.trace(`release 提交 body = ${JSON.stringify(req.body)}`)
            try {
                await $updatePostTerms(req, res, post)
            } catch (e) {
                return res.status(200).json(Result.info(e.message))
            }

            // 记录文章旧状态
            // # 版本只对做 内容，标题，摘录信息，密码，评论状态敏感
            let oldValues = {
                post_title: post.post_title,
                post_content: post.post_content,
                post_name: post.post_name,
                post_excerpt: post.post_excerpt,
                post_date: post.post_date,
                post_status: post.post_status,
                post_password: post.post_password,
                comment_status: post.comment_status
            }
            post.post_title = postTitle
            post.post_content = postContent
            post.post_name = postName || post.id
            // post.guid = post.guid || utils.randomChar(16)
            post.post_excerpt = postExcerpt
            post.post_date = postDate || new Date()
            post.post_status = postStatus
            post.post_password = postPassword
            post.comment_status = commentStatus
            // post.post_author = // 最初的创建者不能修改的 提交的文章作者只会存在版本记录中
            // sticky
            let mdContent = marked(postContent, { renderer: utils.renderer })
            Promise.all([
                common.updateOrCreatePostMeta(id, 'sticky', sticky),
                common.updateOrCreatePostMeta(id, 'render', renderValue),
                common.updateOrCreatePostMeta(id, 'displayContent', mdContent.substr(0, 400))
            ]).then(() => {
                log.trace('成功保存文章 #%d的meta 信息', post.id)
            }).catch(e => log.error('保存文章#%d meta 失败:', post.id, e))

            await post.save()
            // 点击发布，不论是更新还是发布，都会判断内容记录版本
            // 相当于 主分支，而自动保存的版本则相当于是分支，有且只有一个分支
            // if (post.post_status === common.ENUMERATE.PostStatusEnum.PUBLISH) {
            let newValues = {
                post_title: post.post_title,
                post_content: post.post_content,
                post_name: post.post_name,
                post_excerpt: post.post_excerpt,
                post_date: post.post_date,
                post_status: post.post_status,
                post_password: post.post_password,
                comment_status: post.comment_status
            }
            // 检查内容是否修改了，没有修改则不创建版本
            // debug(`是否修改了文章 = ${id}, result = ${result}`)
            let isModify = isEqual(newValues, oldValues) // => true 没有修改
            log.trace('newValues: =', JSON.stringify(newValues))
            log.trace('oldValues: =', JSON.stringify(oldValues))
            log.publishPost(req, post, oldValues, newValues)

            if (!isModify) {
                log.trace(`修改了文章%d#%s， 创建版本`, id, postTitle)
                // 创建版本
                let values = post.toJSON()
                values.post_name = `${id}-revision-v1`
                values.post_status = common.ENUMERATE.PostStatusEnum.INHERIT
                values.post_type = 'revision'
                values.post_date = post.post_date
                values.id = undefined
                values.createdAt = undefined
                values.updatedAt = undefined
                let revision = await postDao.create(values)
                log.create(req, revision, common.ENUMERATE.relatedTypeEnum.revision)
                common.updateOrCreatePostMeta(revision.id, 'author', JSON.stringify(postAuthor || req.user))
            }

            log.trace('发布文章成功，post = ', post.id)
            utils.clearCache()
            next()
            // return res.status(200).json(Result.success(revision))
        } catch (e) {
            log.error('release post error by:', e)
            return res.status(200).json(Result.error())
        }
    },
    $getPostInfo
]

// const resetPostGuid = [
//     async function (req, res, next) {
//         try {
//             let posts = await postDao.findAll({
//                 where: {
//                     post_status: common.ENUMERATE.PostStatusEnum.PUBLISH
//                 }
//             })
//             // posts.forEach(()=>{
//             //
//             // })
//             let p = posts.map(post => (postDao.update({ guid: utils.randomChar(16) }, {
//                 where: { id: post.id },
//                 silent: true
//             })))
//             await Promise.all(p)
//             log.info('重置全部发布文章 guid 成功')
//             return res.status(200).json(Result.success())
//         } catch (e) {
//             log.error('resetPostGuid error by:', e)
//             return res.status(200).json(Result.error())
//         }
//
//     }
// ]

// const test = [
//     function (req, res, next){
//         console.log(req.body)
//         req.sanitizeBody('ids').toArray()
//         console.log(req.body)
//         next()
//     },
//     common.validationResult,
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
router.route('/update-category').post(updateCategory)
router.route('/release').post(release)
router.route('/trash/revert').post(revert)
router.route('/trash/del').post(del)
router.route('/trash').get(getTrash).post(moverTrash)
router.route('/:id').get(postInfo)

// router.route('/reset-guid').post(resetPostGuid)

module.exports = router
