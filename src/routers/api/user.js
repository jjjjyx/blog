/* eslint-disable camelcase */
'use strict'

const express = require('express')
const bcrypt = require('bcryptjs')
const useragent = require('useragent')
const log = require('log4js').getLogger('api.user')
const debug = require('debug')('app:routers:api.user')
const {check} = require('express-validator/check')

const {userDao, userLogDao} = require('../../models/index')
const utils = require('../../utils')
const Result = require('../../common/resultUtils')
const {Enum} = require('../../common/enum')
const common = require('../common')

const router = express.Router()

const createUserLog = function (req, action, type) {
    let user = req.user
    let agent = req.headers['user-agent']
    let agentObj = useragent.parse(agent)
    return userLogDao.create({
        user_id: user.id,
        ip: utils.getClientIp(req),
        action,
        type,
        agent: agentObj.toString()
    })
}

// 密码必须为6-18位 必须包含特殊字符和英文
// const passReg = new RegExp(
//     '^(?![a-zA-z]+$)(?!\\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\\d!@#$%^&*]+$)[a-zA-Z\\d!@#$%^&*]+$')
// log.trace('passReg %s', passReg)
const login = [
    check('username', '账号不可为空且3-6位')
        .isString()
        .withMessage('必须是字符串')
        .isLength({min: 3, max: 6}),
    check('password', '密码为6-18位').isBase64(),
    utils.validationResult,
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
                let result = await utils.create(user)
                req.user = user
                createUserLog(req, '用户登陆', Enum.LogType.LOGIN)
                //Token generated
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

const logout = async function (req, res) {

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
            let result = await utils.create(user)
            createUserLog(req, '修改用户信息', Enum.LogType.UPDATE)
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
    utils.validationResult,
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

                createUserLog(req, '修改密码', Enum.LogType.UPDATE)
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
