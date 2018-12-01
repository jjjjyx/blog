const path = require('path')
const ejs = require('ejs')
const xss = require('xss')
const marked = require('marked')
const groupBy = require('lodash/groupBy')
const toNumber = require('lodash/toNumber')
const debug = require('debug')('app:routers:common')
// const log = require('log4js').getLogger('routers:common')
const {validationResult} = require('express-validator/check')

const utils = require('../utils')
const Result = require('./result')
const Regs = require('./regs')
const Enumerate = require('./enumerate')
const Constant = require('./constant')
const {termDao, userDao, postDao, postMetaDao, commentMetaDao, userMetaDao, sequelize} = require('../models/index')

const {term_relationships: termRelationshipsDao} = sequelize.models
const Op = sequelize.Op
// const COOKIE_MAX_AGE = 365 * 5 * 60000 * 60 * 24 // 5年
// const COOKIE_HTTP_ONLY = true
// const VISITOR_KEY = 'jv'
/**
 * 渲染文章为html
 * @param post 文章实例， 需包含meta user term 属性
 * @returns {string}
 */
function generatePostHtml (post) {
    let {sticky, displayContent, heart = {meta_value: 0}, comment = {meta_value: 0}, read = {meta_value: 0}} = post.metas
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
    let postDate = utils.formatDate(post.post_date, 'YYYY/M/D HH:mm A')
    // metas
    let readNum = read.meta_value
    let commentNum = comment.meta_value
    let likeNum = heart.meta_value

    // 评论关闭不显示
    let commentEl = post.comment_status ? `<a class="j-article__a comment mr-2" href="${url}#comment" target="_blank"> <i class="ivu-icon ivu-icon-ios-chatbubbles-outline" style="font-size: 18px;"></i><span class="num">${commentNum}</span> </a>` : ''

    let {category, postTag} = post.getCategoryOrTags()
    let categoryName = category.name
    let postTagNamesEL = ''
    if (postTag.length)
        postTagNamesEL = '<i class="ivu-icon ivu-icon-pricetag" style="font-size: 16px;"></i>' + postTag.map(tag => `<span class="tag">${tag.name}</span>`)

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
            ${commentEl}
            <a class="j-article__a like mr-2">
                <i class="ivu-icon ivu-icon-ios-heart-outline" style="font-size: 18px;"></i><span class="num">${likeNum}</span>
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
            ${postTagNamesEL}
        </div>
    </div>
</article>`
}


const postInclude = [
    {model: postMetaDao, as: 'metas'},
    {model: userDao, attributes: {exclude: ['user_pass']}},
    {model: termDao, attributes: ['icon', 'description', 'name', 'slug', 'taxonomy', 'id']}
]

async function loadPost ({page = 1, pageSize = 10}, term, excludeIds = []) {
    let where
    if (!term) {
        where = {
            post_status: Enumerate.PostStatusEnum.PUBLISH,
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
            post_status: Enumerate.PostStatusEnum.PUBLISH,
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
    debug('获取文章，共计 %d 篇, %s', posts.length, posts.map(post => '#' + post.id))
    //
    return posts
}

async function loadPostHtml (...a) {
    return (await exports.loadPost.call(this, ...a)).map(exports.generatePostHtml).join('')
}

/**
 * 最新
 * 最近 30 天发布
 */
function loadNewestPost (size = 10) {
    size = toNumber(size)
    let date = new Date()
    date.setDate(date.getDate() - 30)
    return postDao.findAll({
        where: {
            post_status: Enumerate.PostStatusEnum.PUBLISH,
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
function loadHotPost (size) {

}

/**
 * 精选
 * 有封面图片，有插图
 */
function loadChosenPost (size) {

}

const termCountSql = [sequelize.literal('(SELECT COUNT(`term_relationships`.`object_id`) FROM  `j_term_relationships` AS `term_relationships` LEFT JOIN j_posts AS jp ON `term_relationships`.`object_id`=jp.`id`  WHERE `term_relationships`.`term_id` = `term`.`id` AND jp.`post_status`= \'publish\')'), 'count']

function loadTags () {
    return termDao.findAll({
        where: {
            taxonomy: Enumerate.TaxonomyEnum.POST_TAG
        },
        attributes: {
            include: [
                termCountSql
            ]
        },
        order: [['createdAt', 'DESC']]
    }).then(tags => tags.filter(item => item.dataValues.count)) // 标签的查询引用为 0 不显示
}

function loadCategory (size = 10) {
    size = toNumber(size)
    return termDao.findAll({
        where: {
            taxonomy: Enumerate.TaxonomyEnum.CATEGORY,
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
        // 获取除未分类的分类，按照个数排序，取前20个
        // .filter(item => item.defaultValues.count)
        let category = (await exports.loadCategory(SITE.categoryNum))
        debug('category ： 获取分类 共计 %d 个 %s', 20, category.map((tag) => `#${tag.id}:${tag.name}`))
        return renderFile('category', {category})
    },
    // 标签
    tags: async function () {
        let tags = await exports.loadTags()
        tags = tags.filter(item => item.dataValues.count)
        debug('tags ： 获取全部有文章引用的标签 共计 %d 个 %s', tags.length, tags.map((tag) => `#${tag.id}:${tag.name}`))
        if (tags.length) {
            return renderFile('tags', {tags})
        } else {
            return ''
        }
    },
    // 最新
    newest: async function () {
        let newestLength = SITE.lastPostNum // 最近 = 最新
        let posts = await loadNewestPost(newestLength)
        if (posts.length) {
            return renderFile('newest', {posts, formatDate: utils.formatDate, newestLength, groupBy})
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


/**
 * 写死的用户权限
 * @type {{'0': string[], '1': string[], '100': string[]}}
 */
const userRole = {
    0: ['comment'],
    1: ['user', 'comment'],
    100: ['admin']
}

/**
 * 统一的访问限制 key
 * @param req
 * @returns {string}
 */
function ipAndRoute (req) {
    let key = req.clientIp + ':' + req.baseUrl + req.path
    debug('ipAndRoute key = %s', key)
    return key
}

/**
 * 统一的表达验证结果函数
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function validation (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        debug('api = %s 参数错误 %s', req.originalUrl, JSON.stringify(errors.mapped()))
        return res.status(200).json(Result.info('参数错误', errors.mapped()))
    }
    return next()
}

/**
 *  更新创建meta 的统一方法
 * @param dao
 * @param where
 * @param value
 * @returns {*}
 * @private
 */
function _createMetaByMetaDao (dao, where = {}, value) {
    return dao.findOrCreate({
        where,
        defaults: {
            meta_value: value
        }
    }).spread((meta, created) => {
        if (!created) {
            // debug('创建Meta，id = %d, meta key = %s 已存在, 更新', id, key)
            meta.meta_value = value
            return meta.save()
        }
        return true
    })
}
function updateOrCreatePostMeta (id, key, value) {
    return _createMetaByMetaDao(postMetaDao, {post_id: id, meta_key: key}, value)
}
function updateOrCreateCommentMeta (id, key, value) {
    return _createMetaByMetaDao(commentMetaDao, {comment_id: id, meta_key: key}, value)
}
function updateOrCreateUserMeta (id, key, value) {
    return _createMetaByMetaDao(userMetaDao, {user_id: id, meta_key: key}, value)
}

// module.exports.sidebarModuleKey = enumerate.SidebarListEnum
module.exports.ENUMERATE = Enumerate
module.exports.REGS = Regs
module.exports.CONSTANT = Constant
module.exports.Result = Result

module.exports.sidebarModule = sidebarModule
module.exports.termCountSql = termCountSql
module.exports.userRole = userRole
module.exports.postInclude = postInclude
module.exports.ipAndRoute = ipAndRoute
module.exports.generatePostHtml = generatePostHtml
module.exports.loadPost = loadPost
module.exports.loadPostHtml = loadPostHtml
module.exports.loadNewestPost = loadNewestPost
module.exports.loadHotPost = loadHotPost
module.exports.loadChosenPost = loadChosenPost
module.exports.loadTags = loadTags
module.exports.loadCategory = loadCategory
module.exports.validationResult = validation
module.exports.updateOrCreatePostMeta = updateOrCreatePostMeta
module.exports.updateOrCreateCommentMeta = updateOrCreateCommentMeta
module.exports.updateOrCreateUserMeta = updateOrCreateUserMeta

