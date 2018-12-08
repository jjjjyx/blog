'use strict'

const SUCCESS = 0
const ERROR = 1
const WARNING = 2
const INFO = 3

// todo 目前的code 只是提示类型的区分，需要扩展实现多语言

function createResult (code, msg, data) {
    return new Result({ code, msg, data })
}

class Result {
    static success (data) {
        return createResult(SUCCESS, '操作成功', data)
    }

    static error (data) {
        return createResult(ERROR, '发生异常', data)
    }

    static warning (msg, data) {
        return createResult(WARNING, msg, data)
    }

    static info (msg, data) {
        return createResult(INFO, msg, data)
    }

    constructor ({ code, msg, data }) {
        this.code = code
        this.msg = msg
        this.data = data
    }

}

module.exports = Result
