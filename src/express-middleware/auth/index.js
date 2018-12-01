const unless = require('express-unless')
const set = require('lodash/set')
// const debug = require('debug')('app:express-middleware:auth')
const log = require('log4js').getLogger('express-middleware:auth')
const jwt = require('./jwt')
const UnauthorizedError = require('../../errors/UnauthorizedError')
const config = require('../../../config')
let {tokenHeaderKey} = config

const requestProperty = 'user'
log.debug('创建身份验证中间件，并设置 req.%s, tokenHeaderKey = %s', requestProperty, tokenHeaderKey)
const auth = function (req, res, next) {
    if (req.method === 'OPTIONS' && req.headers.hasOwnProperty('access-control-request-headers')) {
        let hasAuthInAccessControl = !!~req.headers['access-control-request-headers']
            .split(',').map(function (header) {
                return header.trim()
            }).indexOf(tokenHeaderKey)
        log.trace('auth hasAuthInAccessControl = %s, req.headers[\'access-control-request-headers\'] = ', hasAuthInAccessControl, req.headers['access-control-request-headers'])
        if (hasAuthInAccessControl) {
            return next()
        }
    }
    let token
    try {
        token = jwt.getToken(req)
    } catch (e) {
        next(e)
    }

    if (!token) {
        return next(new UnauthorizedError('credentials_required', 'No authorization token was found'))
    }

    jwt.verifyToken(token).then((decoded) => {
        log.trace('auth verify success decoded ')
        set(req, requestProperty, decoded)
        set(req, 'token', token)
        next()
    }).catch((err) => {
        log.trace('auth verify fail decoded = %s', err)
        next(new UnauthorizedError('Token Expired', 'Token Expired'))
    })
}
auth.unless = unless
module.exports = auth
