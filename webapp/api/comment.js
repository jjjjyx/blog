import api from './index'

/**
 * 发表评论
 * @param content 评论正文
 * @param parent 评论对象
 * @param comment_parent 父评论
 * @param members 提到的用户
 * @returns {Promise<*>}
 */
export function comment ({content, parent, comment_parent, members = []}) {
    return api.npost('/api/comment', {content, parent, comment_parent, members})
}

export function changeAvatar () {
    return api.nget('/api/reply/change-avatar')
}
export function writeUser (user) {
    return api.npost('/api/reply/write-user', user)
}
export function getComments (filter) {
    return api.nget('/api/reply', filter)
}
