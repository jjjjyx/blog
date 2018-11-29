
// 默认的cookie 过期时间
const COOKIE_MAX_AGE = 365 * 5 * 60000 * 60 * 24 // 5年
// cookie 属性
const COOKIE_HTTP_ONLY = true
// 游客cookie key
const VISITOR_KEY = 'jv'



module.exports = {
    COOKIE_MAX_AGE,
    COOKIE_HTTP_ONLY,
    VISITOR_KEY
}
