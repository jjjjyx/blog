import api from './index'

/**
 * 登录
 * @param username
 * @param password
 */
export function login (username, password) {
    return api.post('/api/user/login', {username, password})
}

/**
 * 验证用户，获取用户信息
 */
export function auth () {
    return api.get('/api/user/auth')
}

/**
 * 修改密码
 * @param oldPass
 * @param newPass
 * @param cpass
 */
export function changePass (oldPass, newPass, cpass) {
    return api.get('/api/user/update/pass', {old_pass: oldPass, new_pass: newPass, cpass})
}

/**
 * 退出登录
 */
export function logout () {
    return api.get('/api/user/logout')
}
