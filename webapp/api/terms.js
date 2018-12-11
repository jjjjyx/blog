import api from './index'

/**
 * 获取全部标签,分类
 * @returns {Promise<*>}
 */
export function fetchAll () {
    return api.nget('/api/term/')
}

/**
 * 创建标签
 * @param tag
 * @returns {Promise<*>}
 */
export function createTag (tag) {
    return api.npost(`/api/term/tag/add`, tag)
}

/**
 * 创建分类
 * @param tag
 * @returns {Promise<*>}
 */
export function createCategory (category) {
    return api.npost(`/api/term/category/add`, category)
}

/**
 * 修改标签
 * @param tag
 * @returns {Promise<*>}
 */
export function updateTag (tag) {
    return api.npost(`/api/term/tag/edit`, tag)
}

/**
 * 修改分类
 * @param tag
 * @returns {Promise<*>}
 */
export function updateCategory (category) {
    return api.npost(`/api/term/category/edit`, category)
}

/**
 * 删除标签
 * @param tag
 * @returns {Promise<*>}
 */
export function deleteTag (ids) {
    return api.npost(`/api/term/tag/del`, { ids })
}

/**
 * 删除分类
 * @param tag
 * @returns {Promise<*>}
 */
export function deleteCategory (ids) {
    return api.npost(`/api/term/category/del`, { ids })
}
