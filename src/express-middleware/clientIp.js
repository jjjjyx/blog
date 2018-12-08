// const is
// const debug = require('debug')('app:express-middleware:clientIP')
const log = require('log4js').getLogger('express-middleware:clientIP')
const set = require('lodash/set')
const utils = require('../utils')

const reqIpProperty = 'clientIp'

// 载入自定义获取客户端ip中间件，设置reqIpProperty = req.%s
log.trace(' Load custom get client ip middleware, set reqIpProperty = req.%s', reqIpProperty)

module.exports = function middleware (req, res, next) {
    const ip = utils.getClientIp(req)
    set(req, reqIpProperty, ip)
    next()
}
