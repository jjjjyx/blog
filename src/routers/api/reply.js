'use strict'

const express = require('express')
const intersectionWith = require('lodash/intersectionWith')
const rateLimiter = require('redis-rate-limiter')
const debug = require('debug')('app:routers:api.comment')

const { sanitizeQuery } = require('express-validator/filter')
const { query } = require('express-validator/check')

const { commentDao, userDao, commentMetaDao } = require('../../models/index')
const jwt = require('../../express-middleware/auth/jwt')
const utils = require('../../utils')
const log = require('../../common/manageLog')('api.comment')
const Result = require('../../common/result')
const common = require('../../common')
const imgList = require('./avatar.json')

const router = express.Router()
const qqReg = common.REGS.QQ_REG
const commentPageSize = common.CONSTANT.LOAD_COMMENT_PAGE_SIZE
const defaultAvatar = config.defaultAvatar

const getCommentById = [
    query('parent').not().isEmpty().withMessage('对象不可为空'),
    sanitizeQuery('page').toInt(),
    query('page').isInt(),
    query('sort').isIn(['desc', 'asc']),
    common.validationResult,
    async function (req, res, next) {
        let { parent, page, sort = 'desc' } = req.query
        try {
            let result = await commentDao.findAll({
                where: {
                    comment_id: parent,
                    comment_parent: null
                },
                include: [
                    {
                        model: commentDao,
                        as: 'child',
                        order: [['createdAt', 'DESC']],
                        include: [{ model: userDao, attributes: { exclude: ['user_pass'] } }, {
                            model: commentMetaDao,
                            as: 'metas'
                        }]
                        // offset: 0,
                        // limit: 10
                    },
                    { model: commentMetaDao, as: 'metas' },
                    { model: userDao, attributes: { exclude: ['user_pass'] } }
                ],
                order: [['createdAt', sort]],
                offset: (page - 1) * commentPageSize,
                limit: commentPageSize
            })
            // 总共评论数， 不包含回复个数
            let total = await commentDao.count({ where: { comment_id: parent, comment_parent: null } })
            // 总共评论数， 包含回复
            let total2 = await commentDao.count({ where: { comment_id: parent } })
            // todo 回复的分页
            log.trace('Load parent object = %s comment list Total %d comments', parent, total)

            // 减少查询次数， 获取全部使用uid 在次遍历填充
            let uids = []
            const handleCommentItem = function (item) {
                let { members } = item.metas
                if (members) {
                    let ids = JSON.parse(members.meta_value).map(item => {
                        let [, , userId] = common.REGS.COMMENT_MEMBERS_REG.exec(item)
                        return parseInt(userId)
                    })
                    item.uids = ids
                    uids = uids.concat(ids)
                }
                // item.comment_content = xss(item.comment_content)
                if (item.child && item.child instanceof Array) {
                    item.child.forEach(handleCommentItem)
                }
            }
            result.forEach(handleCommentItem)
            log.trace('Load parent object = %s comment list, users used in the comment list have = %s', parent, uids.length)
            if (uids.length) {
                let users = await userDao.findAll({
                    where: {
                        id: uids
                    },
                    attributes: {
                        exclude: ['user_pass']
                    }
                })
                const idInUsers = (user, id) => user.id === id
                const handleCommentItem2 = function (item) {
                    // let ids = item.ids
                    item.dataValues.members = intersectionWith(users, item.uids, idInUsers)
                    // delete item.dataValues.metas
                    if (item.child && item.child instanceof Array) {
                        item.child.forEach(handleCommentItem2)
                    }
                }
                result.forEach(handleCommentItem2)
            }


            return res.status(200).json(Result.success({
                result,
                total,
                total_display: total2,
                page
            }))
        } catch (e) {
            log.error('getCommentById error by:', e)
            return res.status(200).json(Result.error())
        }

    }
]

/**

 点击评论时验证用户身份，用户是未登陆状态时，弹出表单填写，
 填入信息为qq 号时自动获取qq 信息填充身份，填入的qq 号将作为登陆号依据，并根据ip 作为一个运算生成一个用户账户
 当用户填写的信息为昵称与邮箱是，随机生成一个用户账户，
 当用户只填写了昵称与网站，不允许评论

 以及生成token 后，需要跟ip绑定，切换ip 或者重新生成需要替换掉

 也就是说 账号的生成由服务器控制，客户端是不可伪造，也能够识别用户
 *
 *
 * 感觉花里胡哨的， 直接使用游客身份得了
 *
 * 如果用户已经登录，则是修改用户信息
 * @type {Function[]}
 */
// 废弃
const writeUser = [
    // rateLimiter.
    // 3 位以上 18 位以下仅包含数字字母，下划线 短横线
    // ip 限制访问频率为1 小时 5
    rateLimiter.middleware({ redis: utils.redisClient, key: common.ipAndRoute, rate: '5/h' }),
    // 限制 每个ip + key 即使用一个key 进行修改用户操作 为 每分钟 3 次， 每小时一个ip 用5次这个api
    // rateLimiter.middleware({redis: client, key: ipAndRouteAndKey, rate: '3/m'}),
    async function (req, res, next) {
        let user
        try {
            let token = jwt.getToken(req)
            user = await jwt.verifyToken(token)
            req.user = user
        } catch (e) {
            debug('writeUser ,token error by', e.message)
        }

        let { user_email, user_url, user_login, user_nickname, user_avatar } = req.body
        if (user) { // 如果已经登录, 提交的账号与登录账号不符 则拒接
            if (user.user_login !== user_login) {
                return res.status(200).json(Result.info('错误的账号'))
            }
        } else if (user_login) { // 没有登录，但是提交账号
            req.checkBody('user_login').custom((value) => {
                debug('writeUser user_login = ', value)
                return /^[a-zA-Z0-9_\\-]{3,18}$/.test(value)
            }).withMessage('请提交正确的账号')
        } else { // 即没有登录，也没提交 随机一个，不能够使用之前的历史，如果用户使用同一个设备，隐身模式的话将会产生记住身份的错误 只需要限制用户的访问频率即可

            // 不存在使用随机生成 ip + 随机值
            req.body.user_login = user_email || `__${utils.randomChar(6)}__`
        }

        if (user_email) {
            req.checkBody('user_email').isEmail().withMessage('请提交正确邮箱')
        }
        if (user_url) {
            req.checkBody('user_url').isURL().withMessage('请提交正确主页')
        }
        if (user_nickname) {
            req.checkBody('user_nickname').isLength({ min: 1, max: 18 }).withMessage('昵称请控制在18个长度以内')
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
    common.validationResult,
    async function (req, res, next) {
        // req.validate()
        // console.log('req.user', req.user)
        // if (req.user) {
        //     return res.status(200).json(Result.info('.'))
        // }
        let { user_email, user_url, user_login, user_nickname, user_avatar } = req.body
        let ip = req.clientIp
        try {
            let user = req.user
            let token
            if (user) {
                user.user_email = user_email
                user.user_url = user_url
                user.user_nickname = user_nickname
                user.user_avatar = user_avatar
                userDao.update({ where: { id: user.id } }, { user_email, user_url, user_nickname, user_avatar })
            } else {
                user = await userDao.findOrCreate({
                    where: {
                        user_login,
                        role: 0
                    },
                    defaults: { user_email, user_url, user_nickname, user_avatar, role: 0 }
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
                delete user.user_pass
                user.permissions = common.userRole[user.role]
                token = await jwt.createToken(user)
            }

            return res.status(200).json(Result.success({
                ...user,
                token
            }))
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return res.status(200).json(Result.info('不要冒充管理员~~~'))
            } else {
                log.error('writeUser Error:', e)
                return res.status(200).json(Result.error())
            }
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

const changeAvatar = [
    function (req, res, next) {

        let url = imgList[Math.floor(Math.random() * imgList.length)]
        // todo 游客的日志
        log.trace('游客修改头像 url', url)
        return res.status(200).json(Result.success(url))
    }
]
router.route('/').get(getCommentById)
router.route('/write-user').post(writeUser)
router.route('/change-avatar').get(changeAvatar)

module.exports = router
