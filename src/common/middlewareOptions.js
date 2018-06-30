const debug = require('debug')('app:middlewareOptions')
const _ = require('lodash')

module.exports.validator = {
    customSanitizers: {
        toArray (value) {
            debug(`customSanitizers toArray(${value})`)
            if (value === null) {
                return []
            }
            if (!_.isArray(value)) {
                return [value]
            }
            return value
        }
    }
}
