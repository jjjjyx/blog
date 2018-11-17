'use strict'

const http = require('http')
const iconv = require('iconv-lite')
const express = require('express')
const debug = require('debug')('app:routers:api.tools')
const log = require('log4js').getLogger('api.tools')
const {query} = require('express-validator/check')

const utils = require('../../utils')
const Result = require('../../common/result')
const common = require('../../common/common')

const router = express.Router()
const redisClient = utils.redisClient
const qqReg = /^[1-9][0-9]{4,}$/
const qqAvater = 'http://q.qlogo.cn/headimg_dl?spec=140&dst_uin='  // 大小 140
const key_suffix = ':ip_for_qq_info'
const ipUpdateCountkey = 'update_count' // 修改次数
// const ipInfoskeys = 'infos' // ip 查询qq信息的历史

log.debug('qq reg = ', qqReg)
log.debug('qq AvatarUrl = ', qqAvater)
log.debug('qq key_suffix = ', key_suffix)

function getQinfoByqq (qq) {
    return new Promise((resolve, reject) => {
        http.get(`http://users.qzone.qq.com/fcg-bin/cgi_get_portrait.fcg?uins=${qq}`, (resp) => {
            let data = []
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data.push(chunk)
            })
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                let body = iconv.decode(Buffer.concat(data), 'gbk')
                body = body.replace(/portraitCallBack\((.+?)\)/, '$1')
                body = Object.values(JSON.parse(body))[0]
                // ["http://qlogo1.store.qq.com/qzone/617044132/617044132/100",231,-1,0,0,0,"蓝鲨捞鱼王",0]
                let nickname = body[6]
                resolve({
                    avatar: `${qqAvater}${qq}`,
                    nickname
                })
            })
        }).on('error', reject)
    })
}

const qinfo = [
    query('key').custom((value) => {
        debug('qinfo qq = ', value)
        return qqReg.test(value)
    }).withMessage('请提交正确的qq'),
    common.validationResult,
    async function (req, res, next) {
        let qq = req.query.key
        log.debug('获取 qq = %s 信息', qq)
        try {
            let ip = req.clientIp
            let uipKey = ip + key_suffix
            let count = await redisClient.hgetAsync(uipKey, ipUpdateCountkey)
            let info
            // 获取成功后，绑定这个ip ，并允许更改5次，并记录
            if (count >= 5) {
                info = JSON.parse(await redisClient.hgetAsync(uipKey, qq))
            } else {
                info = await getQinfoByqq(qq)
                redisClient.hsetAsync(uipKey, qq, JSON.stringify(info))
                redisClient.hincrbyAsync(uipKey, ipUpdateCountkey, 1)
            }
            return res.status(200).json(Result.success(info))
        } catch (e) {
            log.error('qinfo Error:', e)
            next()
        }
    }
]

router.route('/qinfo').get(qinfo)

module.exports = router
