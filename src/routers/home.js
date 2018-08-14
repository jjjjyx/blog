'use strict'

const express = require('express')
const debug = require('debug')('app:routers:home')
const log = require('log4js').getLogger('routers:home')
const _ = require('lodash')
const router = express.Router()
const {Enum} = require('../common/enum')
const {termDao, userDao, postDao, postMetaDao, sequelize, Sequelize} = require('../models')
const Op = sequelize.Op
const utils = require('../utils')

const generatePostHtml = function(post) {
    let metas = post.metas

    // todo 置顶
    let sticky = '<color-icon class="j-article__sticky" type="icon-sticky" size="24"></color-icon>'
    let title = post.post_title
    let url = '/p/' + post.guid

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
    let comment = post.comment_status ? `<a class="j-article__a comment mr-2" href="${url}#comment" target="_blank"> <Icon type="ios-chatbubble-outline" size="20"></Icon><span class="num">${commentNum}</span> </a>`: ''

    let {category = [{name: ''}], post_tag: postTag = []} = _.groupBy(post.terms, 'taxonomy')
    let categoryName = category[0].name
    let postTagNames = postTag.map(tag => `<span class="tag">${tag.name}</span>`)

    return `<article class="j-article-item j-block">
    <div class="j-article-item-content">
        <h3 class="j-article__title">
            <a href="${url}" target="_blank">
                ${title}
            </a>
        </h3>
        <div class="j-article__metas float-right j-article__opt">
            <a class="j-article__a read mr-2" href="${url}" target="_blank">
                <Icon type="ios-eye-outline" size="20"></Icon><span class="num">${readNum}</span>
            </a>
            ${comment}
            <a class="j-article__a like mr-2">
                <Icon type="ios-heart-outline" size="20"></Icon><span class="num">${likeNum}</span>
            </a>
        </div>
        <div class="j-article__a mt-2 mb-4">
            <a title="酱酱酱酱油鲜" class="username">${userName}</a>
            <time class="time" datetime="${postDate}">${postDate}</time>
        </div>
        <p class="j-article__intro">
            互联网的发展，学习是越来越重要了，人们不可能不学习，如果不学习那他将被社会，被互联网淘汰。而博客作为学习的结晶，前人的经验，在学习的路上是很重要的组成部分。博客可以有效的结合图片，文字，能够给读者留下很深刻的影响，为学习带来便利。
            博客具有了个人网站的自由精神，它既可以将个人日记，工作过程，学习笔记，生活见闻，闪现的灵感，记录起来，它能发挥出个人无限创造力，还能结交相识，汇聚朋友，进行深度交流。
            并且如果
        </p>
        <div class="j-article__metas mt-2">
            <Tag type="border" color="blue">${categoryName}</Tag>
            <Icon type="pricetag" size="16"></Icon>
            ${postTagNames}
        </div>
    </div>
</article>`
}

const index = [
    async function(req, res, next) {
        try {
            let posts = await postDao.findAll({
                where: {
                    post_status: Enum.PostStatusEnum.PUBLISH
                },
                include: [
                    {model: postMetaDao, as: 'metas'},
                    {model: userDao, attributes: {exclude: ['user_pass']}},
                    {model: termDao, attributes: ['icon', 'description', 'name', 'slug', 'taxonomy', 'id']}
                ]
            })
            debug('获取首页文章，共计 %d 篇', posts.length)
            log.debug('获取首页文章，共计 %d 篇, %s', posts.length, posts.map(post => '#'+post.id))
            // try {
            // 同步块中产生的异常 无法被错误拦截器捕获啊
            let articleList = posts.map(generatePostHtml).join('')
            res.render('home', {articleList});
        } catch (e) {
            next(e)
        }
        // 文章列表的展示
    }
]
router.route('/').get(index);
router.get('/test', function(req, res, next) {
    res.render('test', {req});
    // console.log("========== next ==========")
    // next()
});

module.exports = router
