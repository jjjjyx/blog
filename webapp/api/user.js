import api from './index'
import { passwordHash } from '../utils/common'

/**
 * 登录
 * @param username
 * @param password
 */
export async function login (username, password) {
    password = await passwordHash(password)
    return api.npost('/api/user/login', { username, password }).then((data) => {
        api.token = data
        return data
    })
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
    let [oldPasshHash, newPassHahs, cpass] = await Promise.all([
        passwordHash(oldPass),
        passwordHash(newPass),
        passwordHash(confirmPass)
    ])

    return api.npost('/api/user/update/pass', { old_pass: oldPasshHash, new_pass: newPassHahs, cpass }).then((data) => {
        api.token = null
        return data
    })
}

/**
 * 修改密码
 * @param oldPass
 * @param newPass
 * @param cpass
 */
export function update ({ user_nickname: userNickname, display_name: displayName, user_email: userEmail, user_url: userUrl }) {
    return api.npost('/api/user/update/info', { userNickname, displayName, userEmail, userUrl })
}

/**
 * 退出登录
 */
export function logout () {
    return api.nget('/api/user/logout')
}
