import api from './index'

/**
 * 获取上传凭证
 * @returns {Promise<*>}
 */
export function token () {
    return api.nget('/api/img/token')
}

/**
 *
 * @param hash 关键词
 * @param space 图片空间
 * @param color 颜色
 * @param page 页码
 * @returns {Promise<*>}
 */
export function fetchAll (page, { hash, space, color }) {
    return api.nget('/api/img/list', { page, hash, space, color })
}

/**
 * 将图片移动到指定空间
 * 支持批量
 * @param key 图片id
 * @param space 空间
 * @returns {Promise<*>}
 */
export function move (keys, space) {
    return api.npost('/api/img/move', { keys, space })
}

export function deleteImg (keys) {
    return api.npost('/api/img/del', { keys })
}

/**
 * 检测失效的图标，
 * 失效的图片包括 存在本地但是已在客户端删除的文件
 * 没有被使用的图片
 * 访问失败的图片
 */
export function detect () {
    return api.npost('/api/img/detect')
}

export const getDetectData = (function getDetectData () {
    let count = 0
    return function () {
        count++
        return api.nget('/api/img/detect', { count })
    }
})()

/**
 * 同步本地与七牛服务器的图片
 * @returns {Promise<*>}
 */
export function sync () {
    return api.nget('/api/img/sync')
}
