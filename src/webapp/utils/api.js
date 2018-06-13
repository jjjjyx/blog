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
        headers['Authorization'] = token;
    }
    let fetchParams = {
        method: method,
        mode: 'cors',
        credentials: 'include',
        headers
    }

    if (data) {
        if (method === 'GET') url += `?${encode(data)}`
        if (method === 'POST') fetchParams.body = encode(data)
    }
    return fetch(url, fetchParams)
}


function get(url, data, header) {
    return do_fetch(url, "GET", data, header);
}
function post(url, data, header) {
    return do_fetch(url, "POST", data, header);
}

function nget(url, info, header) {
    return new Promise(function (resolve, reject) {
        get(url, info, header).then(function (resp) {
            if (resp.ok) {
                resolve(resp.json());
            } else {
                reject(resp.json());
            }
        });
    });
}

function npost(url, info, header) {
    return new Promise(function (resolve, reject) {
        post(url, info, header).then(function (resp) {
            if (resp.ok) {
                resolve(resp.json());
            } else {
                reject(resp.json());
            }
        });
    });
}


export default {
    npost,
    nget,
    get,
    post,
    set token(value) {
        token = 'Bearer ' + value;
    },
    get token() {
        return token
    }
}
