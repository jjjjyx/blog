/* eslint-disable camelcase */
'use strict'

const express = require('express')
const bcrypt = require('bcryptjs')
const useragent = require('useragent')
const log = require('log4js').getLogger('api.user')
const debug = require('debug')('app:routers:api.user')
const {check} = require('express-validator/check')

const {userDao, userLogDao, userMetaDao, sequelize} = require('../../models/index')

const Result = require('../../common/result')
const {Enum} = require('../../common/enum')
const common = require('../../common/common')
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
/**
 * 保存用户，meta 信息
 * @param id
 * @param key
 * @param value
 * @returns {Function}
 * @private
 */
const _saveUserMeta = function (id, key, value) {
    log.info('创建用户Meta，id = %d, key = %s, value = %s', id, key, value)
    return userMetaDao.findOrCreate({
        where: {
            user_id: id,
            meta_key: key
        },
        defaults: {
            meta_value: value
        }
    }).spread((meta, created) => {
        if (!created) {
            log.info('创建用户Meta，id = %d, meta key = %s 已存在, 更新', id, key)
            meta.meta_value = value
            return meta.save()
        }
        return true
    })
}
// 查询用户最后登陆时间
const USER_LAST_LOGIN_TIME_SQL = 'SELECT createdAt FROM j_userlogs WHERE user_id = ? AND TYPE = \'login\' ORDER BY createdAt DESC LIMIT 0, 1'
const _saveUserLastOnlineTime  = function (userId) {
    return sequelize.query(USER_LAST_LOGIN_TIME_SQL, {
        type: sequelize.QueryTypes.SELECT,
        replacements: [userId]
    }).then(([result]) => {
        if (result) {
            let time = (+result.createdAt) / 1000
            _saveUserMeta(userId, 'last_online_time', time)
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
                where: {user_login: username}
            })

            if (null === user) {
                debug('login username = %s, 失败，账号不存在', username)
                return res.status(200).json(Result.info('账号或密码错误'))
            }
            let isMatch = bcrypt.compareSync(password, user.user_pass)
            if (isMatch) {
                log.info('User authenticated, generating token')
                user = user.toJSON()

                delete user.user_pass
                user.permissions = common.userRole[user.role]
                // 新增上次登录时间
                user.lastOnlineTime = await _saveUserLastOnlineTime(user.id)
                let result = await jwt.createToken(user)
                req.user = user
                // 获取上次登录时间，

                // 记录本次登录
                _createUserLog(req, '用户登陆', Enum.LogType.LOGIN)
                // Token generated
                return res.status(200).json(Result.success(result))
                // 获得token
            } else {
                debug('login fail username = %s, password = ***', username)
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
        _createUserLog(req, '退出登录', Enum.LogType.LOGOUT)
        await jwt.destroyToken(token)
        // let {iat, id} = req.user // 签发时间
        // _saveUserMeta(id, 'last_online_time', iat)
        // 访问这个api 成功进来 肯定是登录状态
        // 设置用户退出登录时间，设置登录时间
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
    log.debug('auth = ', JSON.stringify(req.user))
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
                where: {user_login: u1.user_login}
            })
            if (user === null) {
                debug('login username = %s, 修改失败，账号不存在', u1.user_login)
                return res.status(200).json(Result.info('修改失败'))
            }
            user.user_nickname = user_nickname
            user.display_name = display_name
            user.user_email = user_email
            user.user_url = user_url
            await user.save()
            log.info('User info update, generating token')
            user = user.toJSON()

            delete user.user_pass
            user.permissions = common.userRole[user.role]
            let result = await jwt.createToken(user)
            _createUserLog(req, '修改用户信息', Enum.LogType.UPDATE)
            // 更新用户需要更新 token
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

                _createUserLog(req, '修改密码', Enum.LogType.UPDATE)
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
