'use strict'

const debug = require('debug')('app:utils:' + process.pid)
const log = require('log4js').getLogger('utils')
const Promise = require('bluebird')
const moment = require('moment')
// const Redis = require('ioredis')
const redis = require("redis")
const client = redis.createClient()
const JWTR = require('jwt-redis')
const shortid = require('shortid')
const _ = require('lodash')
const {validationResult} = require('express-validator/check')
const Result = require('./common/resultUtils')
const ExpressRedisCache = require('express-redis-cache')
const marked = require('marked')
const renderer = new marked.Renderer()
const config = require('../config')


moment.locale('zh-cn')

const textChar = (text) => text || ' '
const emptyChar = () => ''
for (let i in renderer) {
    renderer[i] = textChar
}
renderer.list = emptyChar
renderer.hr = emptyChar
renderer.tablerow = emptyChar
renderer.table = emptyChar
renderer.code = (code, lang, escaped) => '[code] '
renderer.image = (href, title, text) => '[图片] '
renderer.link = (href, title, text) => '[link] '

const TOKEN_EXPIRATION = 60 // 单位秒
// 5天
const TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60 * 24 * 5
// const TOKEN_EXPIRATION_SEC = 10;
log.trace('TOKEN_EXPIRATION_SEC = %s', TOKEN_EXPIRATION_SEC)

const {secret} = config
// let redis = new Redis()
let cache = ExpressRedisCache({
    client: client
})

client.on("error", function (err) {
    log.error("redis con Error " + err);
});


let jwtr = new JWTR(client)
Promise.promisifyAll(jwtr)
Promise.promisifyAll(client)


// moment.tz.setDefault("Asia/Shanghai")
// log.info('设置时区 Asia/Shanghai')


async function create (obj, expiresIn = TOKEN_EXPIRATION_SEC) {

    if (_.isEmpty(obj)) throw new Error('Data cannot be empty.')
    let token = await jwtr.signAsync(obj, secret, {expiresIn: expiresIn})
    log.info('Token generated for user: %s, token: %s', obj.user_login, token)
    return token
}

// const x="0123456789qwertyuioplkjhgfdsazxcvbnm";
module.exports.randomChar = function (l) {
    // var tmp="";
    // for(var i=0;i<l;i++)  {
    //     tmp += x.charAt(Math.ceil(Math.random()*100000000)%x.length);
    // }
    return shortid.generate()
}

module.exports.validationResult = function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        log.debug('api = %s 参数错误 %s', req.originalUrl, JSON.stringify(errors.mapped()))
        return res.status(200).json(Result.info('参数错误', errors.mapped()))
    }
    return next()
}

module.exports.termReg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/
log.trace('termReg = %s', exports.termReg)
module.exports.formatDate = function (time, pattern = 'YYYY-M-D hh:mm') {
    return moment(time).format(pattern)
}

module.exports.create = create
module.exports.renderer = renderer
module.exports.cache = cache
module.exports.redisClient = client
module.exports.jwtr = jwtr

module.exports.clearCache = function () {
    log.debug('清空路由缓存')
    cache.get((error, entries) => {
        if (error) {
            log.error('清除缓存发生错误', error)
        }
        entries.forEach((item) => {
            cache.del(item.name, () => {
                log.info('清除 %s 缓存', item.name)
            })
        })
    })
}
exports.clearCache()


module.exports.getClientIp = function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}
