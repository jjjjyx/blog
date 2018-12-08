'use strict'

const moment = require('moment')
const crypto = require('crypto')
// const debug = require('debug')('app:before-listen')
const log = require('log4js').getLogger('before-listen')
const { siteDao, termDao } = require('../src/models')
const common = require('./common')
const utils = require('./utils')

function randomHex () {
    let md5 = crypto.createHash('md5')
    md5.update('' + Date.now())
    return md5.digest('hex')
}

module.exports = async function (app) {
    utils.clearCache()
    log.trace('Before-listen register global function')
    let siteList = await siteDao.findAll({
        where: {
            autoLoad: common.ENUMERATE.SiteEnum.YES
        }
    })
    let site = {}
    siteList.forEach((item) => {
        site[item.key] = item.value
    })
    log.trace('Register global system settings：', JSON.stringify(site))
    // 将全部 全局设置更新到全局变量
    global.SITE = site
    // 查询到默认的文章分类

    termDao.findByPk(SITE.defaultCategoryId).then(term => {
        log.trace('Load default category %d#%s', term.name, SITE.defaultCategoryId)
        global.SITE.defaultTerm = term
    })

    /**
     * @return {string}
     */
    let CND_SRC = function (name) {
        return `${SITE.CDN}/${name}`
    }
    app.locals['dev'] = IS_DEV
    app.locals['cdn'] = CND_SRC

    // 创建
    app.locals['dateFormat'] = function (time, f) {
        return moment(time).format(f)
    }
    const hash = randomHex()
    log.trace('resources hash = ', hash)
    // 每次重新启动的时候静态资源都要去除缓存
    app.locals['hash'] = hash
    // app.locals['statistical'] = SITE.statistical;
}
