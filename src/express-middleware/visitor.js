
const common = require('../common')
const utils = require('../utils')
const opLog = require('log4js').getLogger('op.routers')
const log = require('log4js').getLogger('express-middleware:visitor')
const maxAge = common.CONSTANT.COOKIE_MAX_AGE
const httpOnly = common.CONSTANT.COOKIE_HTTP_ONLY
const VISITOR_KEY = common.CONSTANT.VISITOR_KEY


// 初次访问 为这个ip 添加一个游客身份，
// 检查cookie 的值有没有游客标识
// 登陆后游客身份被标识成__xx__ 这种形式，就会使用用户身份，废弃游客身份

log.trace('载入游客中间件，设置游客信息存储为 = req.cookies.%s', VISITOR_KEY)

const visitorMiddleware = function (req, res, next) {
    // let flag = true
    let jv = req.cookies[VISITOR_KEY]
    if (!jv && !/^__.{6,12}__$/.test(jv)) {
        let vid = utils.randomChar()
        opLog.info('游客访问系统，生成cookies.%s = %s', VISITOR_KEY, vid)
        res.cookie(VISITOR_KEY, vid, {maxAge, httpOnly})
    }
    next()
}

module.exports = visitorMiddleware
