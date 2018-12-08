'use strict'

const url = require('url')
const http = require('http')
const https = require('https')
const marked = require('marked')
const moment = require('moment')
const redis = require('redis')
const shortid = require('shortid')
const jsdiff = require('diff')
const Bluebird = require('bluebird')
const isString = require('lodash/isString')
const isArray = require('lodash/isArray')
const transform = require('lodash/transform')
const isEqual = require('lodash/isEqual')
const isObject = require('lodash/isObject')
const ExpressRedisCache = require('express-redis-cache')
const log = require('log4js').getLogger('utils')
// const debug = require('debug')('utils')

const client = redis.createClient()
log.info('Successful connection to redis')

moment.locale('zh-cn')
log.trace('Set time default language = %s', moment.locale('zh-cn'))

const renderer = new marked.Renderer()
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

let cache = ExpressRedisCache({
    client: client
})

client.on('error', function (err) {
    log.error('redis con Error ' + err)
})

// Bluebird.promisifyAll(jwtr)
Bluebird.promisifyAll(client)

// const x="0123456789qwertyuioplkjhgfdsazxcvbnm";
// module.exports.randomChar = function (l) {
// var tmp="";
// for(var i=0;i<l;i++)  {
//     tmp += x.charAt(Math.ceil(Math.random()*100000000)%x.length);
// }
// return tmp
// }
const DEFAULT_TIME_PATTERN = 'YYYY-M-D HH:mm'
log.trace('Default time pattern = %s', DEFAULT_TIME_PATTERN)

/**
 * 格式化时间
 * @param time
 * @param pattern
 * @returns {string}
 */
function formatDate (time, pattern = DEFAULT_TIME_PATTERN) {
    return moment(time).format(pattern)
}

/**
 * 清空路由缓存
 */
function clearCache () {
    cache.get((error, entries) => {
        if (error) {
            log.error('Clear cache error by', error)
        }
        entries.forEach((item) => {
            cache.del(item.name, () => {
                log.debug('Clear %s cache successfully', item.name)
            })
        })
    })
}

const ipv4 = /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/
const ipv6 = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i

function isIp (value) {
    return ipv4.test(value) || ipv6.test(value)
}

/**
 * Parse x-forwarded-for headers.
 *
 * @param {string} value - The value to be parsed.
 * @return {string|null} First known IP address, if any.
 */
function getClientIpFromXForwardedFor (value) {
    if (!value) {
        return null
    }

    if (!isString(value)) {
        throw new TypeError(`Expected a string, got "${typeof value}"`)
    }

    // x-forwarded-for may return multiple IP addresses in the format:
    // "client IP, proxy 1 IP, proxy 2 IP"
    // Therefore, the right-most IP address is the IP address of the most recent proxy
    // and the left-most IP address is the IP address of the originating client.
    // source: http://docs.aws.amazon.com/elasticloadbalancing/latest/classic/x-forwarded-headers.html
    // Azure Web App's also adds a port for some reason, so we'll only use the first part (the IP)
    const forwardedIps = value.split(',').map((e) => {
        const ip = e.trim()
        if (ip.includes(':')) {
            const splitted = ip.split(':')
            // make sure we only use this if it's ipv4 (ip:port)
            if (splitted.length === 2) {
                return splitted[0]
            }
        }
        return ip
    })

    // Sometimes IP addresses in this header can be 'unknown' (http://stackoverflow.com/a/11285650).
    // Therefore taking the left-most IP address that is not unknown
    // A Squid configuration directive can also set the value to "unknown" (http://www.squid-cache.org/Doc/config/forwarded_for/)
    return forwardedIps.find(isIp)
}

/**
 * Determine client IP address.
 *
 * @param req
 * @returns {string} ip - The IP address if known, defaulting to empty string if unknown.
 */
function getClientIp (req) {
    // Server is probably behind a proxy.
    if (req.headers) {
        // Standard headers used by Amazon EC2, Heroku, and others.
        if (isIp(req.headers['x-client-ip'])) {
            return req.headers['x-client-ip']
        }

        // Load-balancers (AWS ELB) or proxies.
        const xForwardedFor = getClientIpFromXForwardedFor(req.headers['x-forwarded-for'])
        if (isIp(xForwardedFor)) {
            return xForwardedFor
        }

        // Cloudflare.
        // @see https://support.cloudflare.com/hc/en-us/articles/200170986-How-does-Cloudflare-handle-HTTP-Request-headers-
        // CF-Connecting-IP - applied to every request to the origin.
        if (isIp(req.headers['cf-connecting-ip'])) {
            return req.headers['cf-connecting-ip']
        }

        // Fastly and Firebase hosting header (When forwared to cloud function)
        if (isIp(req.headers['fastly-client-ip'])) {
            return req.headers['fastly-client-ip']
        }

        // Akamai and Cloudflare: True-Client-IP.
        if (isIp(req.headers['true-client-ip'])) {
            return req.headers['true-client-ip']
        }

        // Default nginx proxy/fcgi; alternative to x-forwarded-for, used by some proxies.
        if (isIp(req.headers['x-real-ip'])) {
            return req.headers['x-real-ip']
        }

        // (Rackspace LB and Riverbed's Stingray)
        // http://www.rackspace.com/knowledge_center/article/controlling-access-to-linux-cloud-sites-based-on-the-client-ip-address
        // https://splash.riverbed.com/docs/DOC-1926
        if (isIp(req.headers['x-cluster-client-ip'])) {
            return req.headers['x-cluster-client-ip']
        }

        if (isIp(req.headers['x-forwarded'])) {
            return req.headers['x-forwarded']
        }

        if (isIp(req.headers['forwarded-for'])) {
            return req.headers['forwarded-for']
        }

        if (isIp(req.headers.forwarded)) {
            return req.headers.forwarded
        }
    }

    // Remote address checks.
    if (req.connection) {
        if (isIp(req.connection.remoteAddress)) {
            return req.connection.remoteAddress
        }
        if (req.connection.socket && isIp(req.connection.socket.remoteAddress)) {
            return req.connection.socket.remoteAddress
        }
    }

    if (req.socket && isIp(req.socket.remoteAddress)) {
        return req.socket.remoteAddress
    }

    if (req.info && isIp(req.info.remoteAddress)) {
        return req.info.remoteAddress
    }

    // AWS Api Gateway + Lambda
    if (req.requestContext && req.requestContext.identity && isIp(req.requestContext.identity.sourceIp)) {
        return req.requestContext.identity.sourceIp
    }

    return ''
}

/**
 * 简单获取url 中json 数据, 方便使用外部调用api
 * @param href
 * @returns {Promise <any>}
 */
function getURLJSONData (href) {
    href = encodeURI(href) // 防止中文
    let urlInfo = url.parse(href)
    let protocol = urlInfo.protocol
    return new Promise((resolve, reject) => {
        let h = protocol === 'https:' ? https : http
        h.get(href, resp => {
            let data = ''
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk
            })

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                try {
                    data = JSON.parse(data)
                    resolve(data)
                } catch (e) {
                    log.error('get url = %s data error by', href, e)
                    reject(e)
                }
                // console.log(JSON.parse(data).explanation);
            })
        }).on('error', reject)
    })
}

/**
 *  转换meta数组形式为对象
 * @param metas 待转换的meta
 * @param key 对象中key
 */
function transformMetasToObject (metas = [], key) {
    // let metas = this.getDataValue('metas')
    return isArray(metas) &&
        metas.reduce((accumulator, currentValue) => {
            accumulator[currentValue[key]] = currentValue
            return accumulator
        }, {})
    // let obj = {}
    // if (isArray(metas)) {
    //     metas.forEach((item) => {
    //         obj[item.meta_key] = item
    //     })
    // }
    // return obj
}

const UNDERLINE_REG = /_(\w)/g

/**
 * 下划线命名转驼峰
 * @param str
 * @returns {void | string | *}
 */
function transformStr3 (str) {
    return str.replace(UNDERLINE_REG, function ($0, $1) {
        return $1.toUpperCase()
    })
}

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function changes (object, base) {
    return transform(object, function (result, value, key) {
        if (!isEqual(value, base[key])) {
            result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : [value, base[key]]
        }
    })
}

function difference (object, base) {
    return changes(object, base)
}

function createPatch (header, oldStr, newStr, { context = 1 } = {}) {
    const diff = jsdiff.structuredPatch('', '', oldStr, newStr, '', '', { context: context })
    let o = `old_${header}`
    let n = `new_${header}`
    let str = `diff: ${o} ${n}
===================================================================
--- ${o}
+++ ${n}
`
    for (let i = 0; i < diff.hunks.length; i++) {
        const hunk = diff.hunks[i]
        str += `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@ ${hunk.lines.join('\n')}
`
    }
    return str
}

module.exports.getURLJSONData = getURLJSONData
module.exports.formatDate = formatDate
module.exports.clearCache = clearCache
module.exports.getClientIp = getClientIp
module.exports.randomChar = shortid.generate
module.exports.renderer = renderer
module.exports.cache = cache
module.exports.redisClient = client
module.exports.transformStr3 = transformStr3
module.exports.difference = difference
module.exports.transformMetasToObject = transformMetasToObject
module.exports.createPatch = createPatch
