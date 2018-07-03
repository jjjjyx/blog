const debug = require('debug')('app:middlewareOptions')
const _ = require('lodash')

module.exports.validator = {
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
