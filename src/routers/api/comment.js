'use strict'

const _ = require('lodash')
const express = require('express')
const router = express.Router()
const debug = require('debug')('app:routers:api.comment')
const log = require('log4js').getLogger('api.comment')
const utils = require('../../utils')
const Result = require('../../common/resultUtils')
const {siteDao, userDao} = require('../../models/index')
const {body} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')
const common = require('../common')
const useragent = require('useragent')

const qqReg = /^[1-9][0-9]{4,}$/
const defaultAvatar = config.defaultAvatar
const comment = [
    function (req, res, next) {
        return res.status(200).json(Result.success())
    }
]

/**
 * 用户首次访问，并进行评论的时候要求完善的表单信息，
 * 表单信息用户生成用户表，返回生成的用户信息，以及 token
 *
 * 如果用户已经登录，则拒接访问
 * @type {Function[]}
 */
const writeUser = [
    // 3 位以上 18 位以下仅包含数字字母，下划线 短横线
    function (req, res, next) {
        let {user_email, user_url, user_login, user_nickname, user_avatar} = req.body
        if (user_login) {
            req.checkBody('user_login').custom((value) => {
                debug('writeUser user_login = ', value)
                return /^[a-zA-Z0-9_\-]{3,18}$/.test(value)
            }).withMessage('请提交正确的账号')
        } else {
            let ip = utils.getClientIp(req)
            // 不存在使用随机生成 ip + 随机值
            req.body.user_login = ip + "__" + utils.randomChar(6)
        }
        if (user_email) {
            req.checkBody('user_email').isEmail().withMessage('请提交正确邮箱')
        }
        if (user_url) {
            req.checkBody('user_url').isURL().withMessage('请提交正确主页')
        }
        if (user_nickname) {
            req.checkBody('user_nickname').isLength({min: 1, max: 18}).withMessage('昵称请控制在18个长度以内')
        }
        if (!(user_login || (user_email && user_nickname))) { // 有提交qq 或者有提交邮箱+ 昵称
            return res.status(200).json(Result.info('请至少提交一个qq号'))
        }
        let isQQ = qqReg.test(user_login)
        if (!isQQ && !user_nickname) { // 提交的不是qq 号， 则必须有昵称
            return res.status(200).json(Result.info('请至少提交一个账号 + 昵称'))
        }

        if (isQQ && !user_nickname) { // 如果是qq 没有提交昵称 则提示异常，可能是获取昵称失败 将昵称补充为 qq 号
            req.body.user_nickname = user_login
        }

        if (user_avatar) {
            // 校验头像是否存在 不存在设置为默认头像
        } else {
            // 填充默认头像
            req.body.user_avatar = defaultAvatar
        }

        next()
    },
    utils.validationResult,
    async function (req, res, next) {
        // req.validate()
        if (req.user) {
            return res.status(200).json(Result.info('.'))
        }
        let {user_email, user_url, user_login, user_nickname, user_avatar} = req.body
        let ip = utils.getClientIp(req)
        try {
            let user = await userDao.findOrCreate({
                where: {user_login, role: 0},
                defaults: {user_email, user_url, user_nickname, user_avatar, role: 0}
            }).spread((user, created) => {
                if (!created) {
                    log.info('创建用户，id = %d, meta key = %s 已存在, 更新', user.id, user_login)
                    user.user_email = user_email
                    user.user_url = user_url
                    user.user_nickname = user_nickname
                    user.user_avatar = user_avatar
                    return user.save()
                }
                return user
            })
            user = user.toJSON()
            // 创建用户 token
            user.permissions = common.userRole[user.role]
            let result = await utils.create(user)
            console.log(result)
            return res.status(200).json(Result.success({
                ...user,
                token: result
            }))
        } catch (e) {
            log.error('writeUser Error:', e)
            return res.status(200).json(Result.error())
        }
        // let agent = req.headers['user-agent']
        // let agentObj =  useragent.parse(agent)
        // let osAgent = agentObj.os.family
        // console.log(agentObj, agentObj.os)
        // debug('comment ip = %s, agent = %s, osAgent = %s', ip, agentObj, osAgent)

        // let userUserage
        // 如果已经有用户身份，则拒接提交


    }
]

router.route('/').post(comment)
router.route('/write-user').post(writeUser)

module.exports = router
