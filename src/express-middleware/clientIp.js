// const is
const utils = require('../utils')
const set = require('lodash/set')
module.exports = function middleware (req, res, next) {
    const ip = utils.getClientIp(req)
    set(req, 'clientIp', ip)
    // Object.defineProperty(req, 'clientIp', {
    //     get: () => ip,
    //     configurable: true
    // })
    next()
}
