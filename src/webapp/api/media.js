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
export function fetchAll ({hash, space, color}, page) {
    return api.nget('/api/img/list', {page, hash, space, color})
}

/**
 * 将图片移动到指定空间
 * @param key 图片id
 * @param space 空间
 * @returns {Promise<*>}
 */
export function move (key, space) {
    return api.nget('/api/img/move', {key, space})
}


export function deleteImg (key) {
    return api.nget('/api/img/del', {key})
}
