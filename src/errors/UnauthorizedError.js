
class UnauthorizedError extends Error {
    constructor (code, message) {
        super()
        Error.captureStackTrace(this, this.constructor)
        this.name = 'UnauthorizedError'
        this.message = message
        this.code = code
        this.status = 401
    }
}
module.exports = UnauthorizedError
