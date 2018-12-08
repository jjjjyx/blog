// 默认的cookie 过期时间
const COOKIE_MAX_AGE = 365 * 5 * 60000 * 60 * 24 // 5年
// cookie 属性
const COOKIE_HTTP_ONLY = true
// 游客cookie key
const VISITOR_KEY = 'jv'

const VISITOR_NAME_PREFIX = '游客_'
// 首页加载文章个数
const LOAD_POST_PAGE_SIZE = 10
const POST_MAX_TAGS_LENGTH = 16
// 评论加载个数
const LOAD_COMMENT_PAGE_SIZE = 15
// 加载图片分页大学
const LOAD_MEDIA_PAGE_SIZE = 100

const TERM_TO_STRING = t => `${t.id}#${t.name}`
const META_TO_STRING = t => `${t.id}#${t.name}`
const USER_TO_STRING = t => `${t.user_login}@${t.user_nickname}`
const COMMENT_TO_STRING = t => `${t.id}@${t.comment_parent ? t.comment_parent : ''}#${t.comment_id}`
const POST_TO_STRING = t => `${t.id}#${t.post_title}`
const SITE_TO_STRING = t => `${t.key}#${t.text} value = ${t.value}`
const RESOURCE_TO_STRING = t => `${t.hash}@${t.space} url = ${t.url}`

module.exports = {
    COOKIE_MAX_AGE,
    COOKIE_HTTP_ONLY,
    VISITOR_KEY,
    VISITOR_NAME_PREFIX,
    POST_MAX_TAGS_LENGTH,
    LOAD_POST_PAGE_SIZE,
    LOAD_COMMENT_PAGE_SIZE,
    LOAD_MEDIA_PAGE_SIZE,
    TERM_TO_STRING,
    META_TO_STRING,
    USER_TO_STRING,
    COMMENT_TO_STRING,
    POST_TO_STRING,
    RESOURCE_TO_STRING,
    SITE_TO_STRING
}
