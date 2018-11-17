const debug = require('debug')('app:express-middleware:validator')
const expressValidator = require('express-validator')
const compact = require('lodash/compact')
const isArray = require('lodash/isArray')
const shortid = require('shortid')

const validator = {
    customSanitizers: {
        toArray (value) {
            debug(`customSanitizers toArray(${value})`)
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
            debug(`isShortid isValid(${value})`)
            return shortid.isValid(value)
        }
    }
}

module.exports = expressValidator(validator)
