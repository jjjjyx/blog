/* eslint-disable camelcase */
'use strict'

const express = require('express')
const bcrypt = require('bcryptjs')
const useragent = require('useragent')
// const log = require('log4js').getLogger('api.user')

const debug = require('debug')('app:routers:api.user')
const {check} = require('express-validator/check')

const {userDao, userLogDao, userMetaDao, sequelize} = require('../../models/index')

const Result = require('../../common/result')
const common = require('../../common')
const log = require('../../common/manageLog')('api.user')
const jwt = require('../../express-middleware/auth/jwt')

const router = express.Router()

/**
 * 创建用户操作日志
 * @param req
 * @param action 操作
 * @param type 类型
 * @returns {*}
 * @private
 */
const _createUserLog = function (req, action, type) {
    let user = req.user
    let agent = req.headers['user-agent']
    let agentObj = useragent.parse(agent)
    return userLogDao.create({
        user_id: user.id,
        ip: req.clientIp,
        action,
        type,
        agent: agentObj.toString()
    })
}

// 查询用户最后登陆时间
const USER_LAST_LOGIN_TIME_SQL = 'SELECT createdAt FROM j_userlogs WHERE user_id = ? AND TYPE = \'login\' ORDER BY createdAt DESC LIMIT 0, 1'
const _saveUserLastOnlineTime  = function (userId) {
    // 查询最后时间，然后在更新
    return sequelize.query(USER_LAST_LOGIN_TIME_SQL, {
        model: userLogDao,
        replacements: [userId]
    }).then(([result]) => {
        if (result) {
            let time = (+result.createdAt) / 1000
            common.updateOrCreateUserMeta(userId, 'last_online_time', time)
            return time
        }
        return null
    })
}

// 密码必须为6-18位 必须包含特殊字符和英文
// const passReg = new RegExp(
//     '^(?![a-zA-z]+$)(?!\\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\\d!@#$%^&*]+$)[a-zA-Z\\d!@#$%^&*]+$')
// log.trace('passReg %s', passReg)
const login = [
    check('username', '账号不可为空且3-6位').isString().withMessage('必须是字符串').isLength({min: 3, max: 6}),
    check('password', '密码为6 - 18位').isBase64(),
    common.validationResult,
    async function (req, res, next) {
        let {username, password} = req.body
        debug('login username = %s, password = ***', username)
        try {
            // 取数据验证
            let user = await userDao.findOne({
                where: {user_login: username},
                include: [
                    {model: userMetaDao, as: 'metas'},
                ]
            })

            if (null === user) {
                log.trace('The login account = %s does not exist,', username)
                return res.status(200).json(Result.info('账号或密码错误'))
            }
            let isMatch = bcrypt.compareSync(password, user.user_pass)
            if (isMatch) {
                log.trace('User authenticated, generating token')
                let {login_time: currentLoginTime = {meta_value: 0}} = user.metas
                user = user.toJSON()


                // 新增上次登录时间
                // 将本次登陆时间记录到上次登陆时间
                let lastLoginTime = parseInt(currentLoginTime.meta_value)
                // 记录本次登陆时间
                currentLoginTime = ~~(new Date() / 1000)
                // 保存
                Promise.all([
                    common.updateOrCreateUserMeta(user.id, 'last_online_time', lastLoginTime),
                    common.updateOrCreateUserMeta(user.id, 'login_time', currentLoginTime),
                ]).then (()=> {
                    log.trace('Record user [%s] login time', user.user_nickname)
                })
                delete user.user_pass
                delete user.metas
                user.permissions = common.userRole[user.role]
                user.lastOnlineTime = lastLoginTime
                user.onlineTime = currentLoginTime
                // user.lastOnlineTime = await _saveUserLastOnlineTime(user.id)
                let result = await jwt.createToken(user)
                req.user = user
                // 获取上次登录时间，

                // Token generated
                log.login(req)
                return res.status(200).json(Result.success(result))
                // 获得token
            } else {
                log.trace('login fail username = %s, password = ***', username)
                return res.status(200).json(Result.info('账号或密码错误'))
            }
        } catch (e) {
            log.error('login error by:', e)
            return res.status(200).json(Result.error())
        }

    }
]

/*
可能存在的登录情况

拿着过期的token 登录失败，后重新登录
    // 监听到token 过期 设置用户过期 获取兼容到下面的情况
用户更换浏览器生成新的token
    // 获取日志最近登录一次登录的时间
    // 更新上次登录时间
用户正常退出登录，清除了浏览器token 重新登录
    获取token 的签发时间作为上次登录时间
 */

const logout = async function (req, res, next) {
    // 清除 token
    let token =  req.token
    try {
        await jwt.destroyToken(token)
        log.logout(req)
        return res.status(200).json(Result.success())
    } catch (e) {
        log.error('logout error by', e)
        // next(e)
        return res.status(200).json(Result.error())
    }
}

const auth = function (req, res, next) {
    res.setHeader('Cache-Control', 'max-age=0, private, must-revalidate')
    res.header('Pragma', 'no-cache')
    res.header('Expires', 0)
    log.trace('auth = ', JSON.stringify(req.user))
    return res.status(200).json(Result.success(req.user))
}

const update_info = [
    check('user_email').isEmail().withMessage('请提交正确邮箱'),
    check('user_url').isURL().withMessage('请提交正确主页'),
    check('user_nickname').isLength({min: 1, max: 18}).withMessage('昵称请控制在18个长度以内'),
    check('display_name').isLength({min: 1, max: 18}).withMessage('显示名称请控制在18个长度以内'),
    common.validationResult,
    async function (req, res, next) {
        let {user_nickname, display_name, user_email, user_url} = req.body

        try {
            let u1 = req.user
            let user = await userDao.findOne({
                where: {user_login: u1.user_login},
                include: [
                    {model: userMetaDao, as: 'metas'}
                ]
            })
            if (user === null) {
                log.trace('The login account = %s does not exist, the modification failed.', u1.user_login)
                return res.status(200).json(Result.info('修改失败'))
            }
            let {login_time: currentLoginTime = {meta_value: 0}, last_online_time: lastLoginTime = {meta_value: 0}} = user.metas
            let oldUser = user.toJSON()
            delete oldUser.user_pass
            user.user_nickname = user_nickname
            user.display_name = display_name
            user.user_email = user_email
            user.user_url = user_url
            await user.save()
            log.trace('User information was successfully modified, Regenerate token')
            user = user.toJSON()

            delete user.user_pass
            delete user.metas
            user.permissions = common.userRole[user.role]
            user.lastOnlineTime = parseInt(lastLoginTime.meta_value)
            user.onlineTime = parseInt(currentLoginTime.meta_value)
            let result = await jwt.createToken(user)

            log.updateUserInfo(req, oldUser, user)
            return res.status(200).json(Result.success(result))
        } catch (e) {
            log.error('update_info error by:', e)
            return res.status(200).json(Result.error())
        }
    }
]
// console.log(check('c_pass','2次密码不一致'))
// "密码强度不够"
const update_pass = [
    // check('old_pass', '原始密码不可为空').isBase64(),
    // check('new_pass', '新密码不可为空').isString().isLength({
    //     min: 6,
    //     max: 18
    // }).withMessage('密码长度在6-18').matches(passReg).withMessage('密码强度不够'),
    // check('cpass', '确认密码不可为空').isString().isLength({
    //     min: 6,
    //     max: 18
    // }).withMessage('密码长度在6-18').matches(passReg).withMessage('密码强度不够'),
    check('old_pass', '原始密码不可为空').isBase64(),
    check('new_pass', '新密码不可为空').isBase64(),
    check('cpass', '确认密码不可为空').isBase64(),
    common.validationResult,
    async function (req, res, next) {

        let {old_pass, new_pass, cpass} = req.body
        // console.log({old_pass, new_pass, cpass})
        let {user_login} = req.user
        if (new_pass !== cpass) {
            debug('用户 = %s, 修改密码失败， 2次密码不一致', user_login)
            return res.status(200).json(Result.info('2次密码不一致'))
        }

        if (new_pass === old_pass) {
            debug('用户 = %s, 修改密码失败， 新密码不可与旧密码一致', user_login)
            return res.status(200).json(Result.info('新密码不可与旧密码一致'))
        }
        try {
            let user = await userDao.findOne({where: {user_login}})
            let isMatch = bcrypt.compareSync(old_pass, user.user_pass)

            let map
            if (isMatch) {
                debug('update user %s pass', user_login)
                log.info('update user %s pass', user_login)
                user.user_pass = bcrypt.hashSync(new_pass)
                await user.save()

                _createUserLog(req, '修改密码', common.ENUMERATE.LogType.UPDATE)
                map = Result.success()
            } else {
                debug('用户 = %s, 修改密码失败， 密码错误', user_login)
                map = Result.info('密码错误')
            }
            return res.status(200).json(map)
        } catch (e) {
            log.error('update_pass error by:', e)
            return res.status(200).json(Result.error())
        }

    }
]

router.route('/login').get((req, res, next) => res.send('这是一个Api')).post(login)

router.route('/logout').get(logout)

router.route('/auth').get(auth)

router.route('/update/info').post(update_info)

router.route('/update/pass').post(update_pass)

module.exports = router
