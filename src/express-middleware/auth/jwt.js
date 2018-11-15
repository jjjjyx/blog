
const isEmpty = require('lodash/isEmpty')
const JWTR = require('jsonwebtoken-redis')
const log = require('log4js').getLogger('express-middleware:jwt')

const utils = require('../../utils')
const config = require('../../../config')
const UnauthorizedError = require('../../errors/UnauthorizedError')

const {secret, tokenExpiration:TOKEN_EXPIRATION, tokenPrefix, tokenHeaderKey } = config

log.debug('TOKEN_EXPIRATION = %s', TOKEN_EXPIRATION)

let jwtr = new JWTR(utils.redisClient, {
    prefix: 'jwt-session:',
    expiresKeyIn: TOKEN_EXPIRATION,
    promiseImpl: Promise
})

async function createToken (user, expiresKeyIn = TOKEN_EXPIRATION) {
    if (isEmpty(user)) throw new Error('Data cannot be empty.')
    let token = await jwtr.sign(user, secret, {expiresKeyIn})
    log.debug('Token generated token: %s', user.user_login, token)
    return token
}

function destroyToken (token) {
    log.debug('destroy Token = %s', token)
    return jwtr.destroy(token)
}

function verifyToken (token) {
    return jwtr.verify(token, secret)
}

function getToken (req) {
    let token
    if (req.headers && req.headers[tokenHeaderKey]) {
        let parts = req.headers.authorization.split(' ')
        if (parts.length === 2) {
            let scheme = parts[0]
            let credentials = parts[1]

            if (tokenPrefix === scheme) {
                token = credentials
            } else {
                throw new UnauthorizedError('credentials_bad_scheme', 'Format is Authorization: Bearer [token]')
            }
        } else {
            throw new UnauthorizedError('credentials_bad_format', 'Format is Authorization: Bearer [token]')
        }
    }
    return token
}



module.exports.createToken = createToken
module.exports.destroyToken = jwtr.destroy
module.exports.verifyToken = verifyToken
module.exports.decode = jwtr.decode
module.exports.getToken = getToken
