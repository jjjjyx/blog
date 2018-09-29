'use strict'

const _ = require('lodash')
const express = require('express')
const router = express.Router()
const debug = require('debug')('app:routers:api.comment')
const log = require('log4js').getLogger('api.comment')
const utils = require('../../utils')
const Result = require('../../common/resultUtils')
const {commentDao} = require('../../models/index')
const {body} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')
const common = require('../common')
const useragent = require('useragent')
const url = require('url')
const rateLimiter = require('redis-rate-limiter');


const comment = [
    // 如果频率次数过多给出验证码
    // 限制访问频率为 每分钟8
    // 验证 Referer
    rateLimiter.middleware({redis: utils.redisClient, key: common.ipAndRoute, rate: '8/m'}),
    function (req, res, next) {
        let referer = req.headers['referer']
        if (!referer) return res.status(200).json(Result.info('评论失败'))
        let {pathname} = url.parse(referer)
        let {parent} = req.body
        if (!(pathname && pathname.endsWith(parent))) {
            log.info('未提交正确的referer， 评论失败！', )
            return res.status(200).json(Result.info('评论失败'))
        }
        next()
    },
    body('parent').not().isEmpty().withMessage('评论对象不可为空'),
    body('content').isLength({min:2, max: 1000}),
    sanitizeBody('comment_parent').toInt(),
    body('comment_parent').custom((value, {req}) => {
        if (!value) return true
        return commentDao.findOne({where: {id: value}}).then((obj) => {
            return obj !== null
        })
    }),
    utils.validationResult,
    async function (req, res, next) {

        // console.log('req.body', req.body)
        // 创建
        let {parent, content, comment_parent} = req.body
        let {user_nickname, user_email, user_url, id, user_avatar} = req.user
        let ip = utils.getClientIp(req)

        let agent = req.headers['user-agent']
        let agentObj =  useragent.parse(agent)
        let osAgent = agentObj.os.family

        log.debug('用户 %s#%s 发表评论', req.user.id, req.user.user_login)
        log.debug('comment ip = %s, agent = %s, osAgent = %s', ip, agentObj, osAgent)

        let comment = {
            comment_id: parent,
            comment_content: content,
            comment_parent: comment_parent ? comment_parent: null,
            comment_author: user_nickname,
            comment_author_email: user_email,
            comment_author_url: user_url,
            comment_author_avatar: user_avatar,
            comment_author_ip: ip,
            comment_agent: agentObj.toString(),
            user_id: id
        }
        try {
            // let [{max = 0}] = await sequelize.query(queryCommentKarma, {type: sequelize.QueryTypes.SELECT, replacements: [parent]})
            let max = await commentDao.max('comment_karma',{where: {comment_id: parent}})
            max = (max || 0) + 1
            comment.comment_karma = max
            let result = await commentDao.create(comment)
            log.info('创建评论，ID = ', result.id)
            result.dataValues.user = req.user
            return res.status(200).json(Result.success(result))
        } catch (e) {
            log.error('comment error by:', e)
            return res.status(200).json(Result.error())
        }
    }
]

router.route('/').post(comment)

module.exports = router
