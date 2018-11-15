const debug = require('debug')('app:express-middleware:validator')
const expressValidator = require('express-validator')
const _ = require('lodash')

const validator = {
    customSanitizers: {
        toArray (value) {
            debug(`customSanitizers toArray(${value})`)
            if (value === null) {
                return []
            }
            let arr = value
            if (!_.isArray(value)) {
                arr = [value]
            }
            return _.compact(arr)
        }
    }
}

module.exports = expressValidator(validator)
