import api from './index'


/**
 * 点击喜欢文章
 * @param guid
 * @returns {Promise<*>}
 */
export function heart (guid) {
    return api.npost('/article/heart', { guid })
}

export function read (guid) {
    return api.npost('/article/read', { guid })
}
