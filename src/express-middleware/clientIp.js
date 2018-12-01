// const is
// const debug = require('debug')('app:express-middleware:clientIP')
const log = require('log4js').getLogger('express-middleware:clientIP')
const set = require('lodash/set')
const utils = require('../utils')

const reqIpProperty = 'clientIp'

log.trace('载入自定义中间件，设置客户端reqIpProperty = req.%s', reqIpProperty)

module.exports = function middleware (req, res, next) {
    const ip = utils.getClientIp(req)
    set(req, reqIpProperty, ip)
    next()
}
