'use strict'

const express = require('express')
const debug = require('debug')('app:routers:home')
const log = require('log4js').getLogger('routers:home')
const _ = require('lodash')
const router = express.Router()
const Result = require('../common/resultUtils')
const {body, query} = require('express-validator/check')
const {sanitizeBody, sanitizeQuery} = require('express-validator/filter')
const {Enum} = require('../common/enum')
const {termDao, userDao, postDao, postMetaDao, sequelize, Sequelize} = require('../models')
const Op = sequelize.Op
const utils = require('../utils')
const xss = require('xss')
const marked = require("marked")


const loadPostPageSize = 10
log.debug('loadPostPageSize = %d', loadPostPageSize)

const generatePostHtml = function(post) {
    let {sticky, displayContent} = post.getMetasObj()
    // todo 置顶
    // let sticky = '<color-icon class="j-article__sticky" type="icon-sticky" size="24"></color-icon>'
    let title = post.post_title
    let url = '/article/' + post.guid

    // 标题过长允许换行，但是超过一定个数需要截断  最大为 100
    // todo 如果在左侧显示图片，最大为60个字符
    if (title.length > 100) {
        title = title.substr(0, 100)
    }

    // 用户
    let userName = post.user.user_nickname
    let postDate = utils.formatDate(post.post_date, 'YYYY/M/D hh:mm')
    // metas
    let readNum = 0
    let commentNum = post.comment_count || 0
    let likeNum = 0

    // 评论关闭不显示
    let comment = post.comment_status ? `<a class="j-article__a comment mr-2" href="${url}#comment" target="_blank"> <i class="ivu-icon ivu-icon-ios-chatbubble-outline" style="font-size: 20px;"></i><span class="num">${commentNum}</span> </a>`: ''

    let {category = [{name: ''}], post_tag: postTag = []} = _.groupBy(post.terms, 'taxonomy')
    let categoryName = category[0].name
    let postTagNames = postTag.map(tag => `<span class="tag">${tag.name}</span>`)


    let postContent // = marked(post.post_content, {renderer: utils.renderer})
    if (displayContent) {
        postContent = displayContent.meta_value
    } else {
        postContent = marked(post.post_content, {renderer: utils.renderer})
    }
    // 获取图片位置进行截取
    // 没有图 显示200 个长度
    postContent = postContent.substr(0, 200)
    return `<article class="j-article-item j-block">
    <div class="j-article-item-content">
        <h3 class="j-article__title">
            <a href="${url}" target="_blank">
                ${xss(title)}
            </a>
        </h3>
        <div class="j-article__metas float-right j-article__opt">
            <a class="j-article__a read mr-2" href="${url}" target="_blank">
                
                <i class="ivu-icon ivu-icon-ios-eye-outline" style="font-size: 20px;"></i><span class="num">${readNum}</span>
            </a>
            ${comment}
            <a class="j-article__a like mr-2">
                <i class="ivu-icon ivu-icon-ios-heart-outline" style="font-size: 20px;"></i><span class="num">${likeNum}</span>
            </a>
        </div>
        <div class="j-article__a mt-2 mb-4">
            <a title="酱酱酱酱油鲜" class="username">${userName}</a>
            <time class="time" datetime="${postDate}">${postDate}</time>
        </div>
        <p class="j-article__intro">
            ${xss(postContent)}...
        </p>
        <div class="j-article__metas mt-2">
            <Tag type="border" color="blue">${categoryName}</Tag>
            <Icon type="pricetag" size="16"></Icon>
            ${postTagNames}
        </div>
    </div>
</article>`
}

const loadPost = async function (page = 1) {
    let posts = await postDao.findAll({
        where: {
            post_status: Enum.PostStatusEnum.PUBLISH
        },
        include: [
            {model: postMetaDao, as: 'metas'},
            {model: userDao, attributes: {exclude: ['user_pass']}},
            {model: termDao, attributes: ['icon', 'description', 'name', 'slug', 'taxonomy', 'id']}
        ],
        offset: (page - 1) * loadPostPageSize,
        limit: loadPostPageSize
    })
    debug('获取首页文章，共计 %d 篇', posts.length)
    log.debug('获取首页文章，共计 %d 篇, %s', posts.length, posts.map(post => '#'+post.id))
    // try {
    // 同步块中产生的异常 无法被错误拦截器捕获啊
    let articleList = posts.map(generatePostHtml).join('')
    return articleList
}

const index = [
    // utils.cache.route('index'),
    async function(req, res, next) {
        try {
            let articleList = await loadPost(1)
            res.render('home', {articleList});
        } catch (e) {
            next(e)
        }
        // 文章列表的展示
    }
]

const more = [
    sanitizeQuery('page').toInt(),
    query('page').isInt(),
    utils.validationResult,
    async function(req, res, next) {
        let {page} = req.query
        try {
            let result = await loadPost(page)
            res.send(result)
        } catch (e) {
            log.error('loadPost  error by:', e)
            return res.status(200).json(Result.error())
        }
    }
]

router.route('/').get(index);
router.route('/more').get(more);
router.get('/test', function(req, res, next) {
    res.render('test', {req});
    // console.log("========== next ==========")
    // next()
});

module.exports = router
