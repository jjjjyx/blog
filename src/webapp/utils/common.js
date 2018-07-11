
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
    console.log(timeInMs, pattern)
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

export function dateFormat (timeInMs, pattern) {
    if (_.isNumber(timeInMs)) {
        return new Date(timeInMs).format(pattern || 'yyyy/MM/dd hh:mm')
    } else if (_.isDate(timeInMs)) {
        return timeInMs.format(pattern || 'yyyy/MM/dd hh:mm') || '-'
    } else {
        return new Date(timeInMs).format(pattern || 'yyyy/MM/dd hh:mm') || '-'
    }
}
