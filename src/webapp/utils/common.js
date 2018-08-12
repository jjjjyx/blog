
import _ from 'lodash'

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

export const verification = function (name) {
    let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/
    let result = reg.test(name)
    // if(!result)
    //     layer.alert("请提交正确的分类名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！")
    return result
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
    if (_.isNumber(timeInMs)) {
        return new Date(timeInMs).format(pattern)
    } else if (_.isDate(timeInMs)) {
        return timeInMs.format(pattern) || '-'
    } else {
        return new Date(timeInMs).format(pattern) || '-'
    }
}

export function transformMetas (metas = []) {
    let obj = {}
    if (_.isArray(metas)) {
        metas.forEach((item) => {
            obj[item.meta_key] = item
        })
    }
    return obj
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
