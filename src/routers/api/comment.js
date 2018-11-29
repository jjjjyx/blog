'use strict'

const url = require('url')
const xss = require('xss')
const express = require('express')
const useragent = require('useragent')
const rateLimiter = require('redis-rate-limiter')
const find = require('lodash/find')
const {sanitizeBody} = require('express-validator/filter')
const {body} = require('express-validator/check')
const debug = require('debug')('app:routers:api.comment')
const log = require('log4js').getLogger('api.comment')

const {commentDao, postDao, userDao, sequelize} = require('../../models/index')
const Result = require('../../common/result')
const common = require('../../common')
const utils = require('../../utils')


const router = express.Router()

const COMMENT_KEY = 'comment'
const incrementPostComment = `UPDATE j_postmeta SET meta_value = meta_value + 1 WHERE post_id = (SELECT id FROM j_posts WHERE guid = ? and post_status = 'publish') AND meta_key = '${COMMENT_KEY}'`
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
            log.info('未提交正确的referer， 评论失败！')
            return res.status(200).json(Result.info('评论失败'))
        }
        next()
    },
    body('parent').not().isEmpty().withMessage('评论对象不可为空'),
    body('content').isLength({min: 2, max: 1000}),
    sanitizeBody('comment_parent').toInt(),
    body('comment_parent').custom((value, {req}) => {
        if (!value) return true
        return commentDao.findOne({where: {id: value}}).then((obj) => {
            return obj !== null
        })
    }),
    common.validationResult,
    async function (req, res, next) {
        req.sanitizeBody('members').toArray()
        let {parent, content, comment_parent, members} = req.body
        let {user_nickname, user_email, user_url, id, user_avatar} = req.user
        let ip = req.clientIp

        let agent = req.headers['user-agent']
        let agentObj = useragent.parse(agent)
        let osAgent = agentObj.os.family

        let members_users = []
        if (members.length) {
            // 解析 members
            members = [...new Set(members)]
            let isReply = 0
            let userIds = members.map(item => {
                let [, prefix, userId] = common.REGS.COMMENT_MEMBERS_REG.exec(item)
                if (prefix === '%') isReply = userId
                return userId
            })
            members_users = await userDao.findAll({
                where: {
                    id: userIds
                },
                attributes: {
                    exclude: ['user_pass']
                }
            })

            if (isReply) {
                let u = find(members_users, ['id', parseInt(isReply)])
                debug('回复 用户id = %s, user does it exist = %s', isReply, !!u)
                if (u) {
                    content = `回复 @${u.user_nickname} : ` + content
                }
            }
        }

        log.debug('用户 %s#%s 发表评论', req.user.id, req.user.user_login)
        log.debug('comment ip = %s, agent = %s, osAgent = %s', ip, agentObj, osAgent)

        let comment = {
            comment_id: parent,
            comment_content: content,
            comment_parent: comment_parent ? comment_parent : null,
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
            let max = await commentDao.max('comment_karma', {where: {comment_id: parent}})
            max = (max || 0) + 1
            comment.comment_karma = max
            let result = await commentDao.create(comment)
            log.info('创建评论，ID = ', result.id)
            result.dataValues.user = req.user
            result.dataValues.members = members_users
            // result.comment_content = xss(result.comment_content)
            // 创建result meta
            common.updateOrCreateCommentMeta(result.id, 'members', JSON.stringify(members))
            // 更新文章评论数  以后有别评论对象这里需要进行拆分


            let [, metadata] = await sequelize.query(incrementPostComment, {replacements: [parent]})
            if (metadata.changedRows === 0) {
                // common.createMetaByMetaDao(postMetaDao, {post_id: })
                let post = await postDao.findOne({
                    where: {guid: parent}, attributes: ['id']
                })
                if (post !== null) {
                    await common.updateOrCreatePostMeta(post.id, COMMENT_KEY, 1)
                }
            }

            return res.status(200).json(Result.success(result))
        } catch (e) {
            log.error('comment error by:', e)
            return res.status(200).json(Result.error())
        }
    }
]

router.route('/').post(comment)

module.exports = router
