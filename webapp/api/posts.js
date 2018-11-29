import api from './index'

/**
 * 获取全部文章
 * @returns {Promise<*>}
 */
export function fetchAll () {
    return api.nget('/api/post/')
}

/**
 * 创建新的文章 状态为草稿，标题为空
 * @param post
 * @returns {Promise<*>}
 */
export function create (post = {post_title: ''}) {
    return api.npost('/api/post/new_post', post)
}

/**
 * 保存文章 更新文章实例
 * 注意这个不是业务的更新文章， 需要更新显示在暂时的文章调用业务方法 `release`
 * @param post
 * @returns {Promise<*>}
 */
export function update (post) {
    return api.npost('/api/post/save', post)
}

/**
 * 获取文章详情
 * @param id
 * @returns {Promise<*>}
 */
export function get (id) {
    return api.nget(`/api/post/${id}`)
}

/**
 * 发布文章
 * @param post
 * @returns {Promise<*>}
 */
export function release (post) {
    return api.npost('/api/post/release', post)
}

/**
 * 获取回收站
 * @returns {Promise<*>}
 */
export function fetchTrashAll () {
    return api.nget('/api/post/trash')
}

/**
 * 批量移动文章至回收站。
 * @param ids
 * @returns {Promise<*>}
 */
export function moveTrash (ids) {
    return api.npost(`/api/post/trash`, {ids})
}

/**
 * 从回收站批量删除文章
 * @param ids
 * @returns {Promise<*>}
 */
export function deleteTrash (ids) {
    return api.npost(`/api/post/trash/del`, {ids})
}

/**
 * 批量从回收站还原文章
 * @param ids
 * @returns {Promise<*>}
 */
export function trashRevert(ids) {
    return api.npost(`/api/post/trash/revert`, {ids})
}

export function changePostCategory (id, category_id) {
    return api.npost(`/api/post/update-category`, {id, category_id})
}
