import api from './index'


export function changeAvatar () {
    return api.nget('/api/reply/change-avatar')
}
export function writeUser (user) {
    return api.npost('/api/reply/write-user', user)
}
export function getComments (filter) {
    return api.nget('/api/reply', filter)
}
