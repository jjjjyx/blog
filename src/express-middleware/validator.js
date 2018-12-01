// const debug = require('debug')('app:express-middleware:validator')
const log = require('log4js').getLogger('express-middleware:validator')
const expressValidator = require('express-validator')
const compact = require('lodash/compact')
const isArray = require('lodash/isArray')
const shortid = require('shortid')

log.trace('载入自定义验证器')

const validator = {
    customSanitizers: {
        toArray (value) {
            log.trace(`customSanitizers toArray(${value})`)
            if (value === null) {
                return []
            }
            let arr = value
            if (!isArray(value)) {
                arr = [value]
            }
            return compact(arr)
        }
    },
    customValidators: {
        isShortid (value) {
            log.trace(`isShortid isValid(${value})`)
            return shortid.isValid(value)
        }
    }
}

module.exports = expressValidator(validator)
