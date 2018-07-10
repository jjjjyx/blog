'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:api.site')
const utils = require('../utils')
const Result = require('../common/resultUtils')
const {siteDao, termDao} = require('../models');
const {body} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')
const {Enum, labels} = require('../common/enum')

const update = [
    sanitizeBody('key').trim(),
    sanitizeBody('value').trim(),
    body('key').exists().withMessage("key 为必须").isString().withMessage("请提交正确的key"),
    body('value').exists().withMessage("value 为必须").isString().withMessage('请提及正确的value'),
    utils.validationResult,
    async function (req, res) {
        let {key, value} = req.body
        debug(`updateSite key= [${key}] value =[${value}]`)
        try {
            let values = {value}
            await siteDao.update(values,{
                where:{
                    key
                }
            })
            // 检查是否是在初始价值的值，是的话重新加载

            siteDao.findAll({
                where: {
                    autoLoad: Enum.SiteEnum.YES
                }
            }).then((sites)=>{
            // 更新后 更新全局对象
                debug('更新全局SITE')
                // console.log('sites', sites)
                let site = {}
                sites.forEach((item)=>{
                    site[item.key] = item.value
                })
                global.SITE = site
                termDao.findById(SITE.defaultCategoryId).then(term => {
                    global.SITE.defaultTerm = term
                })
            })
            return res.status(200).json(Result.success())
        } catch (e) {
            debug('editTerm error by :', e.message)
            return res.status(200).json(Result.error())
        }
    }
]
const getSite = [
    async function (req, res) {
        let siteList = await siteDao.findAll()
        return res.status(200).json(Result.success(siteList))
    }
]
const getDict = async function (req, res) {
    let siteList = await siteDao.findAll()
    // let enums = labels
    return res.status(200).json(Result.success({site: siteList, labels}))
}

router.route("/update").post(update)
router.route("/").get(getSite)
router.route("/dict").get(getDict)

module.exports = router
