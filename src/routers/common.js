const path = require('path')
const xss = require('xss')
const marked = require('marked')
const _ = require('lodash')
const ejs = require('ejs')
const utils = require('../utils')
const {Enum} = require('../common/enum')
const {termDao, userDao, postDao, postMetaDao, sequelize} = require('../models')
const {term_relationships: termRelationshipsDao} = sequelize.models
const Op = sequelize.Op
const log = require('log4js').getLogger('routers')

module.exports.generatePostHtml = function (post) {
    let {sticky, displayContent} = post.metas
    let stickyHtml = ''
    // if (sticky) {
    //     console.log('post.id = ', post.id, '  sticky.meta_value', sticky.meta_value, ' ====', sticky.meta_value === '1')
    // }
    if (sticky && sticky.meta_value === '1')
        stickyHtml = '<color-icon class="j-article__sticky" type="icon-color-sticky" size="24" title="置顶"></color-icon>'
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
    let comment = post.comment_status ? `<a class="j-article__a comment mr-2" href="${url}#comment" target="_blank"> <i class="ivu-icon ivu-icon-ios-chatbubble-outline" style="font-size: 20px;"></i><span class="num">${commentNum}</span> </a>` : ''

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
            <a href="${url}" target="_blank"> ${stickyHtml} ${xss(title)} </a>
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

const postInclude = [
    {model: postMetaDao, as: 'metas'},
    {model: userDao, attributes: {exclude: ['user_pass']}},
    {model: termDao, attributes: ['icon', 'description', 'name', 'slug', 'taxonomy', 'id']}
]
module.exports.postInclude = postInclude
module.exports.loadPost = async function ({page = 1, pageSize = 10}, term, excludeIds = []) {
    let where
    if (!term) {
        where = {
            post_status: Enum.PostStatusEnum.PUBLISH,
            id: {
                [Op.notIn]: excludeIds
            }
        }
    } else {
        let tp = await termRelationshipsDao.findAll({
            where: {
                term_id: term.id
            }
        })
        let postIds = tp.map((item) => item.object_id)
        where = {
            post_status: Enum.PostStatusEnum.PUBLISH,
            id: {
                [Op.in]: postIds,
                [Op.notIn]: excludeIds
            }
        }
    }

    let posts = await postDao.findAll({
        where,
        include: postInclude,
        offset: (page - 1) * pageSize,
        limit: pageSize,
        order: [
            ['post_date', 'DESC']
        ]
    })
    log.debug('获取文章，共计 %d 篇, %s', posts.length, posts.map(post => '#' + post.id))
        //
    return posts
}
module.exports.loadPostHtml = async  function (...a) {
    return (await exports.loadPost.call(this, ...a)).map(exports.generatePostHtml).join('')
}
/**
 * 最新
 * 最近 30 天发布
 */
module.exports.loadNewestPost = function (size = 10) {
    size = _.toNumber(size)
    let date = new Date()
    date.setDate(date.getDate() - 30)
    return postDao.findAll({
        where: {
            post_status: Enum.PostStatusEnum.PUBLISH,
            post_date: {[Op.gte]: date}
        },
        include: postInclude,
        offset: 0,
        limit: size
    })
}
/**
 * 热门
 * 评论多，浏览多
 */
module.exports.loadHotPost = function (size) {

}
/**
 * 精选
 * 有封面图片，有插图
 */
module.exports.loadChosenPost = function (size) {

}
const termCountSql = [sequelize.literal('(SELECT COUNT(`term_relationships`.`object_id`) FROM  `j_term_relationships` AS `term_relationships` LEFT JOIN j_posts AS jp ON `term_relationships`.`object_id`=jp.`id`  WHERE `term_relationships`.`term_id` = `term`.`id` AND jp.`post_status`= \'publish\')'), 'count']
module.exports.loadTags = function () {
    return termDao.findAll({
        where: {
            taxonomy: Enum.TaxonomyEnum.POST_TAG
        },
        attributes: {
            include: [
                termCountSql
            ]
        },
        order: [['createdAt', 'DESC']]
    })
}

module.exports.loadCategory = function (size = 10) {
    size = _.toNumber(size)
    return termDao.findAll({
        where: {
            taxonomy: Enum.TaxonomyEnum.CATEGORY,
            id: {
                [Op.ne]: SITE.defaultCategoryId
            },
            icon: {
                [Op.not]: null,
                [Op.ne]: ''
            }
        },
        attributes: {
            include: [
                termCountSql
            ]
        },
        // order: [['count', 'desc']],
        order: sequelize.literal('count DESC'),
        offset: 0,
        limit: size
    })
}

const renderFile = function (name, data = {}, options = {}) {
    return ejs.renderFile(path.join(__dirname, `../views/template/${name}.ejs`), data, options)
}
/**
 * 归档查询
 * @type {string}
 */
const archiveSql = `
SELECT 
  t.*,
  COUNT(*) as count
FROM (SELECT DATE_FORMAT(post_date, '%Y 年%m 月') AS post_date2, DATE_FORMAT(post_date, '%Y%m') as post_date FROM j_posts WHERE post_status = 'publish') AS t 
GROUP BY t.post_date2,  t.post_date
ORDER BY post_date DESC
`

const sidebarModule = {
    // 关于博主
    about: function () {
        return renderFile('about')
    },
    // 热门
    hot: async function () {
        // 评论与阅读的综合排序
        return '' //renderFile('hot')
    },
    // 精选
    chosen: function () {
        return renderFile('chosen')
    },
    // 分类
    category: async function () {
        // 获取除未分类的分类，按照个数拍戏，取前20个
        let category = await exports.loadCategory(SITE.categoryNum)
        log.isDebugEnabled() && log.debug('category ： 获取分类 共计 %d 个 %s', 20, category.map((tag) => `#${tag.id}:${tag.name}`))
        return renderFile('category', {category})
    },
    // 标签
    tags: async function () {
        let tags = await exports.loadTags()
        tags = tags.filter(item => item.dataValues.count)
        log.isDebugEnabled() && log.debug('tags ： 获取全部有文章引用的标签 共计 %d 个 %s', tags.length, tags.map((tag) => `#${tag.id}:${tag.name}`))
        if (tags.length) {
            return renderFile('tags', {tags})
        } else {
            return ''
        }
    },
    // 最新
    newest: async function () {
        let newestLength = SITE.lastPostNum // 最近 = 最新
        let posts = await exports.loadNewestPost(newestLength)
        if (posts.length) {
            return renderFile('newest', {posts, formatDate: utils.formatDate, newestLength, _})
        } else { // 没有最新文章 返回空
            return ''
        }
    },
    // 归档
    archives: async function () {
        // 查询最近5个月
        let result = await sequelize.query(archiveSql, {type: sequelize.QueryTypes.SELECT})
        return renderFile('archives', {data: result})
    },
    // 搜索
    search: function () {
        // todo 标签推荐。。
        return renderFile('search')
    }
}


const sidebarListEnum = [
    {name: '关于博主', key: 'about'},
    {name: '热门文章', key: 'hot'},
    {name: '精选文章', key: 'chosen'},
    {name: '分类', key: 'category'},
    {name: '标签', key: 'tags'},
    {name: '最新文章', key: 'newest'},
    {name: '归档', key: 'archives'},
    {name: '搜索', key: 'search'}
]

module.exports.sidebarModuleKey = sidebarListEnum
module.exports.sidebarModule = sidebarModule
module.exports.termCountSql = termCountSql

const userRole = {
    0: ['comment'],
    1: ['user','comment'],
    100: ['admin']
}

module.exports.userRole = userRole
