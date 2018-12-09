'use strict'
// const server = 'http://localhost:3879'

/* eslint-disable */
const stringifyPrimitive = function (v) {
    switch (typeof v) {
    case 'string':
        return v
    case 'boolean':
        return v ? 'true' : 'false'
    case 'number':
        return isFinite(v) ? v : ''
    default:
        return ''
    }
}

function encode (obj, sep = '&', eq = '=', name) {
    if (obj === null) {
        obj = undefined
    }

    if (typeof obj === 'object') {
        return Object.keys(obj).map(function (k) {
            var ks = encodeURIComponent(stringifyPrimitive(k)) + eq
            if (Array.isArray(obj[k])) {
                if (!obj[k].length) return ks
                return obj[k].map(function (v) {
                    return ks + encodeURIComponent(stringifyPrimitive(v))
                }).join(sep)
            } else if (obj[k] instanceof Date) {
                return ks + encodeURIComponent(obj[k])
            } else {
                return ks + encodeURIComponent(stringifyPrimitive(obj[k]))
            }
        }).join(sep)

    }

    if (!name) return ''
    return encodeURIComponent(stringifyPrimitive(name)) + eq +
        encodeURIComponent(stringifyPrimitive(obj))
}

class HttpBaseError extends Error {
    constructor (message, code, data) {
        super()
        this.name = 'HttpBaseError'
        this.code = code
        this.data = data
        this.message = message
        Error.captureStackTrace(this, this.constructor)
    }
}

const RespStatusMap = {
    401: '尚未登录',
    403: '尚未登录',
    404: '(～￣▽￣)～ ，404 了呢',
    429: '(～￣▽￣)～ ，服务器繁忙，稍后重试',
    500: '(～￣▽￣)～ ，服务器出错了'
}

export {
    HttpBaseError
}

const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
}

let token
if (localStorage.getItem('authorization')) {
    token = 'Bearer ' + localStorage.getItem('authorization')
}

function do_fetch (url, method, data, header = {}) {
    const headers = Object.assign({}, defaultHeaders, header)
    if (token) {
        headers['Authorization'] = token
    }
    let fetchParams = {
        method: method,
        mode: 'same-origin',
        credentials: 'same-origin',
        headers
    }

    if (data) {
        if (method === 'GET') url += `?${encode(data)}`
        if (method === 'POST') fetchParams.body = encode(data)
    }
    return fetch(url, fetchParams)
}


function get (url, data, header) {
    return do_fetch(url, 'GET', data, header)
}

function post (url, data, header) {
    return do_fetch(url, 'POST', data, header)
}

const handle = async function (resp) {
    if (resp.ok) {
        let { code, data, msg } = await resp.json()
        if (code === 0) {
            data = data || msg
            return data
        } else {
            throw new HttpBaseError(msg, code, data)
        }
    } else {
        let message = RespStatusMap[resp.status] || RespStatusMap[500]
        throw new HttpBaseError(message, resp.status)
    }
}

async function nget (url, info, header) {
    let resp
    try {
        resp = await get(url, info, header)
    } catch (e) {
        throw new HttpBaseError('(～￣▽￣)～ ，url 地址不正确呢')
    }
    return await handle(resp)
}


async function npost (url, info, header) {
    let resp
    try {
        resp = await post(url, info, header)
    } catch (e) {
        throw new HttpBaseError('(～￣▽￣)～ ，url 地址不正确呢')
    }
    return await handle(resp)
}

export default {
    npost,
    nget,
    get,
    post,
    set token (value) {
        console.log('更新用户token')
        if (value) {
            token = 'Bearer ' + value
            localStorage.setItem('authorization', value)
        } else {
            localStorage.removeItem('authorization')
        }
    },
    get token () {
        return token
    }
}
