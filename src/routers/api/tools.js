'use strict'

const http = require('http')
const _ = require('lodash')
const express = require('express')
const router = express.Router()
const debug = require('debug')('app:routers:api.tools')
const log = require('log4js').getLogger('api.tools')
const utils = require('../../utils')
const Result = require('../../common/resultUtils')
const {siteDao, termDao} = require('../../models/index')
const {query} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')
const common = require('../common')
const iconv = require('iconv-lite');

const qqReg = /^[1-9][0-9]{4,}$/
// 根据 qq 号获取昵称 头像
// const qqAPI = 'http://users.qzone.qq.com/'

const qqAvater = 'http://q.qlogo.cn/headimg_dl?spec=140&dst_uin='  // 大小 140
// function portraitCallBack (p) {
//     return Object.values(p)[0]
// }
const qinfo = [
    query('key').custom((value) => {
        debug('qinfo qq = ', value)
        return qqReg.test(value)
    }).withMessage('请提交正确的qq'),
    utils.validationResult,
    function (req, res, next) {
        let qq = req.query.key
        log.debug('获取 qq = $s 信息', qq)
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
                body =  Object.values(JSON.parse(body))[0]
                // ["http://qlogo1.store.qq.com/qzone/617044132/617044132/100",231,-1,0,0,0,"蓝鲨捞鱼王",0]
                let nickname = body[6]
                return res.status(200).json(Result.success({
                    avatar: `${qqAvater}${qq}`,
                    nickname
                }))
            })
        }).on('error', (err) => {
            log.error('qinfo Error:', err)
        })
    }
]

router.route('/qinfo').get(qinfo)

module.exports = router
