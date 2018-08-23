/* eslint-disable camelcase */
'use strict'
const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()
const debug = require('debug')('app:routers:api.user')
const log = require('log4js').getLogger('api.user')
const {check} = require('express-validator/check')
const utils = require('../../utils')
const Result = require('../../common/resultUtils')
const {userDao} = require('../../models/index')
// 密码必须为6-18位 必须包含特殊字符和英文
const passReg = new RegExp(
    '^(?![a-zA-z]+$)(?!\\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\\d!@#$%^&*]+$)[a-zA-Z\\d!@#$%^&*]+$')
log.trace('passReg %s', passReg)
const login = [
    check('username', '账号不可为空且3-6位')
        .isString()
        .withMessage('必须是字符串')
        .isLength({min: 3, max: 6}),
    check('password', '密码为6-18位')
        .isString()
        .withMessage('必须是字符串')
        .isLength({min: 6, max: 18}),
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
                let result = await utils.create(user)
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

const auth = function (req, res, next) {
    res.setHeader('Cache-Control', 'max-age=0, private, must-revalidate')
    res.header('Pragma', 'no-cache')
    res.header('Expires', 0)
    log.debug('auth = ', JSON.stringify(req.user))
    return res.status(200).json(Result.success(req.user))
}

const update_info = [

    function (req, res, next) {

    }
]
// console.log(check('c_pass','2次密码不一致'))
// "密码强度不够"
const update_pass = [
    check('old_pass', '原始密码不可为空').isString().isLength({min: 6, max: 18}),
    check('new_pass', '新密码不可为空').isString().isLength({
        min: 6,
        max: 18
    }).withMessage('密码长度在6-18').matches(passReg).withMessage('密码强度不够'),
    check('cpass', '确认密码不可为空').isString().isLength({
        min: 6,
        max: 18
    }).withMessage('密码长度在6-18').matches(passReg).withMessage('密码强度不够'),
    utils.validationResult,
    async function (req, res, next) {
        let {old_pass, new_pass, cpass} = req.body
        let {user_login} = req.user
        if (new_pass !== cpass) {
            debug('用户 = %s, 修改密码失败， 2次密码不一致', user_login)
            return res.status(200).json(Result.info('2次密码不一致'))
        }
        try {
            let user = await userDao.findOne({where: {user_login}})
            let isMatch = bcrypt.compareSync(old_pass, user.user_pass)

            let map
            if (isMatch) {
                debug('update user %s pass', user_login)
                log.info('update user %s pass', user_login)
                user.user_pass = bcrypt.hashSync(new_pass)
                user.save()
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

router.route('/auth').get(auth)

router.route('/update/info').post(update_info)

router.route('/update/pass').post(update_pass)

module.exports = router
