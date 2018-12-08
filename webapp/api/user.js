import api from './index'
import { passwordHash } from '../utils/common'

/**
 * 登录
 * @param username
 * @param password
 */
export async function login (username, password) {
    password = await passwordHash(password)
    return api.npost('/api/user/login', { username, password }).then((data) => (api.token = data, data))
}

/**
 * 验证用户，获取用户信息
 */
export function auth () {
    return api.nget('/api/user/auth')
}

/**
 * 修改密码
 * @param oldPass
 * @param newPass
 * @param cpass
 */
export async function changePass ({ oldPass, newPass, confirmPass }) {
    let [old_pass, new_pass, cpass] = await Promise.all([
        passwordHash(oldPass),
        passwordHash(newPass),
        passwordHash(confirmPass)
    ])

    return api.npost('/api/user/update/pass', { old_pass, new_pass, cpass }).then((data) => (api.token = null, data))
}

/**
 * 修改密码
 * @param oldPass
 * @param newPass
 * @param cpass
 */
export function update ({ user_nickname, display_name, user_email, user_url }) {
    return api.npost('/api/user/update/info', { user_nickname, display_name, user_email, user_url })
}

/**
 * 退出登录
 */
export function logout () {
    return api.nget('/api/user/logout')
}
