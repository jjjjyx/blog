const _ = require('lodash')
const re = /_(\w)/g;
const utils = require('../utils')
const xss = require('xss')
const marked = require("marked")
// const {termDao, userDao, postDao, postMetaDao, sequelize} = require('../models')
// const {term_relationships: termRelationshipsDao } = sequelize.models
module.exports.transformStr3 = function(str) {
    return str.replace(re, function ($0, $1){
        return $1.toUpperCase();
    });
}

module.exports.transformMetas = function (metas = []) {
    let obj = {}
    if (_.isArray(metas)) {
        metas.forEach((item) => {
            obj[item.meta_key] = item
        })
    }
    return obj
}

module.exports.generatePostHtml = function (post) {
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
    let postTagNames = ''
    if (postTag.length)
        postTagNames = '<i class="ivu-icon ivu-icon-pricetag" style="font-size: 16px;"></i>' + postTag.map(tag => `<span class="tag">${tag.name}</span>`)


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
            <div class="ivu-tag ivu-tag-blue ivu-tag-border ivu-tag-checked">
                <span class="ivu-tag-text ivu-tag-color-blue">${categoryName}</span>
            </div>
            ${postTagNames}
        </div>
    </div>
</article>`
}

