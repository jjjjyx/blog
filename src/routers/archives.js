'use strict'


const express = require('express')
const _ = require('lodash')
const moment = require('moment')
const router = express.Router()
const debug = require('debug')('app:routers:archives')
const common = require('../common')
const log = require('log4js').getLogger('routers:tags')
const { formatDate } = require('../utils')
router.get('/', async function (req, res, next) {
    try {
        // 查询所有发布文章，按照时间排序，按照时间月份分组
        let result = await common.loadPost({ pageSize: 999999 })
        let group = _.groupBy(result, item => moment(item.post_date).format('MMM YY'))
        // result.forEach((item)=>{
        //     let time = moment(item.post_date).format("MMM YY")
        //     group[time] = group[time]||[]
        //     group[time].push(item);
        // })
        // log.isDebugEnabled() && log.debug('archives ： 归档预览 共计 0 个分组， x 个', tags.length, tags.map((tag) => `#${tag.id}:${tag.name}`))
        res.render('archives', { groupData: group, formatDate, moment })
    } catch (e) {
        next(e)
    }
})

module.exports = router
