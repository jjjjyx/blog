/**
 * 时间格式化
 * @param format
 * @returns
 */
/* eslint-disable no-extend-native */
Date.prototype.format = function (format) {
    let o = {
        'M+': this.getMonth() + 1, // month
        'd+': this.getDate(), // day
        'h+': this.getHours(), // hour
        'm+': this.getMinutes(), // minute
        's+': this.getSeconds(), // second
        'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
        'S': this.getMilliseconds() // millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
    }
    return format
}

const CTRL_MASK = 0x1000
const ALT_MASK = 0x2000
const SHIFT_MASK = 0x4000

export function getMetaKeyCode (e) {
    let metaKeyCode = 0
    if (e.ctrlKey || e.metaKey) {
        metaKeyCode |= CTRL_MASK
    }
    if (e.altKey) {
        metaKeyCode |= ALT_MASK
    }
    if (e.shiftKey) {
        metaKeyCode |= SHIFT_MASK
    }
    metaKeyCode |= e.keyCode
    return metaKeyCode
}

export function getTimeText (timeInMs, pattern = 'yy/MM/dd') {
    let ms = Math.abs(timeInMs - new Date())
    let s = ms / 1000
    let m = s / 60
    let h = m / 60
    if (s < 60) return `${s | 0}秒前`
    if (m < 60) return `${m | 0}分钟前`
    if (h < 24) return `昨天`
    if (h > 24 && h < 24 * 30) return `${~~(h / 24)}天前`
    // if (h > 24 * 30) return ``
    return dateFormat(timeInMs, pattern)
}

const defaultDatePattern = 'yyyy/MM/dd hh:mm'

export function dateFormat (timeInMs, pattern = defaultDatePattern) {
    if (!isNaN(timeInMs)) {
        return new Date(timeInMs).format(pattern)
    } else if (timeInMs instanceof Date) {
        return timeInMs.format(pattern) || '-'
    } else {
        return new Date(timeInMs).format(pattern) || '-'
    }
}

const x = '0123456789qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM'

export function randomChar (l = 6) {
    let tmp = ''
    for (let i = 0; i < l; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length)
    }
    return tmp
}

export function formatFileSize (fileSize) {
    let temp
    if (fileSize < 1024) {
        return fileSize + 'B'
    } else if (fileSize < (1024 * 1024)) {
        temp = fileSize / 1024
        temp = temp.toFixed(0)
        return temp + 'KB'
    } else if (fileSize < (1024 * 1024 * 1024)) {
        temp = fileSize / (1024 * 1024)
        temp = temp.toFixed(1)
        return temp + 'MB'
    } else {
        temp = fileSize / (1024 * 1024 * 1024)
        temp = temp.toFixed(2)
        return temp + 'GB'
    }
}

export const POST_WRITER_STATUS = {
    // normal: '',
    // save: '已保存',
    // saveing: '保存中',
    // edit: '已修改 - 未保存',
    // auto_draft: '自动草稿',

    created: '创建于',
    edited: '编辑于',
    saved: '保存于',
    saving: '保存中',
    posted: '发布于'
}

export function hyphenToHump (str) {
    return str.replace(/-(\w)/g, (all, letter) => letter.toUpperCase())
}

/**
 *  see https://github.com/fy0/Icarus/blob/master/src/tools/user.js#L34-L56
 */
const salt = '$2a$10$TGNVlss6zdAFpROsn2SX0exhg6N/gMlY.nI/kpDiMmoid.PFBvKVK'
const _passwordResultToText = function (keyBuffer, saltUint8, iterations) {
    const keyArray = Array.from(new Uint8Array(keyBuffer)) // key as byte array
    const saltArray = Array.from(new Uint8Array(saltUint8)) // salt as byte array

    const iterHex = ('000000' + iterations.toString(16)).slice(-6) // iter’n count as hex
    const iterArray = iterHex.match(/.{2}/g).map(byte => parseInt(byte, 16)) // iter’ns as byte array

    const compositeArray = [].concat(saltArray, iterArray, keyArray) // combined array
    const compositeStr = compositeArray.map(byte => String.fromCharCode(byte)).join('') // combined as string
    const compositeBase64 = btoa('v01' + compositeStr) // encode as base64

    return compositeBase64 // return composite key
}
// const passwordHashAsmCrypto =

let passwordHashAsmCrypto = function (password, iterations = 1e5) {
    return import('asmcrypto.js/dist_es8/pbkdf2/pbkdf2-hmac-sha512.js').then((module) => {
        const Pbkdf2HmacSha512 = module.Pbkdf2HmacSha512
        let enc = new TextEncoder()
        const pwUtf8 = enc.encode(password) // encode pw as UTF-8
        const saltUint8 = enc.encode(salt)
        let keyBuffer = Pbkdf2HmacSha512(pwUtf8, saltUint8, iterations, 32)
        return _passwordResultToText(keyBuffer, saltUint8, iterations)
    })
}

async function passwordHashNative (password, iterations = 1e5) {
    let crypto = window.crypto || window.msCrypto // for IE 11
    let enc = new TextEncoder()
    const pwUtf8 = enc.encode(password) // encode pw as UTF-8
    const pwKey = await crypto.subtle.importKey('raw', pwUtf8, 'PBKDF2', false, ['deriveBits']) // create pw key
    const saltUint8 = enc.encode(salt)

    const params = { name: 'PBKDF2', hash: 'SHA-512', salt: saltUint8, iterations: iterations } // pbkdf2 params
    const keyBuffer = await crypto.subtle.deriveBits(params, pwKey, 256) // derive key
    return _passwordResultToText(keyBuffer, saltUint8, iterations)
}

export const passwordHash = (function passwordHash () {
    if (crypto.subtle && crypto.subtle.importKey) {
        return passwordHashNative
    } else {
        return passwordHashAsmCrypto
    }
})()
