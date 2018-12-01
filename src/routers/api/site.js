'use strict'


const intersection = require('lodash/intersection')
const express = require('express')

const debug = require('debug')('app:routers:api.site')
const log = require('log4js').getLogger('api.site')
const {siteDao, termDao, postDao, resourceDao} = require('../../models/index');
const common = require('../../common')
const Result = require('../../common/result')

const router = express.Router()

const updateSite = function (key, value) {
    // return function () {
        log.debug('修改全局设置 key = %s, value = %s', key, value)
        return siteDao.update({value}, {
            where: {key}
        })
    // }
}

const update = [
    // sanitizeBody('key').trim(),
    // sanitizeBody('value').trim(),
    // body('key').exists().withMessage("key 为必须").isString().withMessage("请提交正确的key"),
    // body('value').exists().withMessage("value 为必须").isString().withMessage('请提及正确的value'),
    // common.validationResult,
    async function (req, res) {
        // req.sanitizeBody('keys').toArray()
        // req.sanitizeBody('values').toArray()
        // let {keys, values} = req.body

        let keys = Object.keys(req.body)

        log.isDebugEnabled() && log.debug(`updateSite body = %s`, JSON.stringify(req.body))

        try {
            // if (keys.length !== values.length || keys.length === 0) {
            //     return res.status(200).json(Result.info('参数个数不正确'))
            // }
            let allKeys = await siteDao.findAll({attributes: ['key']}).map(i => i.key)
            let allowKey = intersection(allKeys, keys)
            debug('site.update allowKey = %s', allowKey)
            let ups = allowKey.map(key => updateSite(key, req.body[key]))

            await Promise.all(ups)
            log.info('修改全局配置成功, 更新SITE')
            allowKey.forEach((key) => {
                // 也许默认分类的这个东西就不该放在 全局设置
                if (key === 'defaultCategoryId') {
                    termDao.findByPk(req.body[key]).then(term => {
                        global.SITE.defaultTerm = term
                        SITE.defaultCategoryId = req.body[key]
                    }).catch(() => {
                        log.info('site.update 设置默认分类失败，找不到该分类 %s:', req.body[key])
                    })
                } else {
                    SITE[key] = req.body[key]
                }
            })
            return res.status(200).json(Result.success())
        } catch (e) {
            log.error('site.update error by :', e)
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
    return res.status(200).json(Result.success({site: siteList}))
}

const getStatistics = function (req, res) {
    // 查询一些数据
    // 文章个数， 标签数， 图片数
    Promise.all([
        postDao.count({where: {post_status: common.ENUMERATE.PostStatusEnum.PUBLISH}}),
        termDao.count({where: {taxonomy: common.ENUMERATE.TaxonomyEnum.POST_TAG}}),
        resourceDao.count()
    ]).then(([publishPostNum, tagNum, mediaNum]) => {
        return res.status(200).json(Result.success({publishPostNum, tagNum, mediaNum}))
    })

}

router.route("/update").post(update)
router.route("/").get(getSite)
router.route("/dict").get(getDict)
router.route("/statistics").get(getStatistics)

module.exports = router
