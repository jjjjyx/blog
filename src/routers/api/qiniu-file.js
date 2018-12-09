'use strict'

const isString = require('lodash/isString')
const difference = require('lodash/difference')
const differenceBy = require('lodash/differenceBy')
const express = require('express')

const Color = require('color')
const uuidv1 = require('uuid/v1')

// const debug = require('debug')('app:routers:api.qiniu-file')

const { check } = require('express-validator/check')
const { sanitizeQuery } = require('express-validator/filter')

const { resourceDao, sequelize } = require('../../models/index')
const log = require('../../common/manageLog')('api.qiniu-file')
const Result = require('../../common/result')
const common = require('../../common')
const utils = require('../../utils')
const qiniuApi = require('../../qiniuApi')

const router = express.Router()
const imgSpaces = Object.values(common.ENUMERATE.ImgEnum)
const Op = sequelize.Op
const domain = config.qiUpload.Domain
const BUCKET_NAME = config.qiUpload.BUCKET_NAME
const allowSpace = Object.values(common.ENUMERATE.ImgEnum)

const mediaPageSize = common.CONSTANT.LOAD_MEDIA_PAGE_SIZE
const sanitizeSpace = sanitizeQuery('space')
    .customSanitizer((value) => {
        log.trace(`sanitizeSpace v = ${value}`)
        if (allowSpace.indexOf(value) === -1) {
            return common.ENUMERATE.ImgEnum.ALL
        } else {
            return value
        }
    })
// let checkAllowSpace = ['public', 'cover', 'post', 'avatar']
const checkSpace = check('space').isIn(allowSpace)

async function handleImage (image, req) {
    // putTime, type, status,
    let { key, hash, fsize, mimeType, remark, space = common.ENUMERATE.ImgEnum.ALL } = image
    let url = domain + key
    let color = await qiniuApi.getImageAveByUrl(url)
    color = color.replace('0x', '#')
    let { width, height, format: ext } = await qiniuApi.getImageInfo(url)
    let uuid = uuidv1()
    let values = {
        key,
        hash,
        size: fsize,
        bucket: BUCKET_NAME,
        name: key, // 这里获取到都是没有文件名称了 使用key 做文件名
        height,
        width,
        color,
        mimeType,
        ext,
        url,
        uuid,
        space,
        remark
    }
    return resourceDao.findOrCreate(
        { where: { hash }, defaults: values }
    ).spread((img, created) => {
        if (created) {
            log.create(req, img, common.ENUMERATE.relatedTypeEnum.image)
        }
        return img
    })
    // 获取图片颜色
    // @see
}

/**
 * 上传token
 * @type {Function[]}
 */
const token = [
    async function (req, res) {
        res.header('Cache-Control', 'max-age=0, private, must-revalidate')
        res.header('Pragma', 'no-cache')
        res.header('Expires', 0)
        let token = qiniuApi.uploadToken()

        log.trace('Generate an upload voucher')
        if (token) {
            return res.status(200).json(Result.success(token))
        } else {
            return res.status(200).json(Result.error('获取token失败'))
        }
    }
]

/**
 * 查询图片
 * @type {any[]}
 */
const list = [
    check('page').isInt(),
    // check('hash').isString(),
    sanitizeSpace,
    // check('space').isInt(),
    common.validationResult,
    async function (req, res) {
        let { page, space, hash, color } = req.query
        log.trace('Query to get a list of pictures query = ', JSON.stringify(req.query))
        page = parseInt(page || 1)
        let where = {}
        if (space !== common.ENUMERATE.ImgEnum.ALL) {
            where.space = space
        }

        if (hash && isString(hash)) {
            where[Op.or] = []
            where[Op.or].push({ hash: { [Op.like]: `%${hash}%` } })
            where[Op.or].push({ name: { [Op.like]: `%${hash}%` } })
        }
        log.trace('Query to get a list of pictures where =', JSON.stringify(where))
        let offset = (page - 1) * mediaPageSize
        try {
            let result = await resourceDao.findAll({
                where,
                limit: mediaPageSize,
                offset: offset,
                order: ['hash']
            })
            // 筛选颜色
            // Color
            try {
                let c1 = Color(color)
                result = result.filter((item) => c1.contrast(Color(item.color)) < 3)
            } catch (e) {
                log.trace('Conversion color = %s failed ', color)
            }

            let total = await resourceDao.count({ where })
            let data = {
                result,
                total,
                page,
                maxPage: Math.ceil(total / mediaPageSize),
                // 判断是否最后一页
                next: offset + mediaPageSize >= total ? false : page + 1
            }
            return res.status(200).json(Result.success(data))
        } catch (e) {
            log.error('getMediaAll error by :', e)
            return res.status(200).json(Result.error())
        }
    }
]

/**
 * 移动图片
 * @type {any[]}
 */
const move = [
    // sanitizeBody('key').trim(),
    checkSpace,
    // check('key').exists(),
    common.validationResult,
    async function (req, res, next) {
        req.sanitizeBody('keys').toArray()
        let { space, keys } = req.body
        log.trace(`Moving space file key = %s， space = %s`, keys, space)
        try {
            await resourceDao.update({ space }, {
                where: { hash: keys }
            })
            log.changeImageSpace(req, keys, space)
            return res.status(200).json(Result.success())
        } catch (e) {
            log.error(`移动空间文件 key = %s 失败 `, keys, e)
            return res.status(200).json(Result.info('移动空间文件'))
        }
    }
]
/**
 * 删除图片
 * @type {*[]}
 */
const del = [
    // check('key').exists().isString().withMessage('请提交 key !'),
    // common.validationResult,
    async function (req, res) {
        // let key = req.body.key
        req.sanitizeBody('keys').toArray()
        let { keys } = req.body
        log.trace(`删除空间文件 key = `, keys)
        try {
            let failKey = await qiniuApi.syncDelete(keys)
            // 去掉失败的key
            let successKey = difference(keys, failKey)
            await resourceDao.destroy({
                paranoid: false,
                force: true,
                where: { hash: successKey }
            })
            log.delete(req, successKey, common.ENUMERATE.relatedTypeEnum.image)
            // 清除探测缓存
            $$resetFlag()
            return res.status(200).json(Result.success({ fail: failKey }))
        } catch (e) {
            log.error(`删除空间文件 key = %s 失败,原因`, keys, e)
            return res.status(200).json(Result.info('删除文件失败'))
        }
    }
]

/**

 * @param req.body = {
            "key":"FhLm2F4r8Njh7Al50LSEYfD8Z49r",
            "hash":"FhLm2F4r8Njh7Al50LSEYfD8Z49r",
            "size":2286,
            "bucket":"jyximg",
            "name":"null",
            "info":{"colorModel":"nrgba","format":"png","height":252,"size":2286,"width":316},
            "imageAve":{"RGB":"0x6c6f70"},
            "exif": null,
            "mimeType": "image/png"
            "ext": null,
            "uuid": "c1cba196-4533-46ff-98fb-bb1f15849b8d"
        }
 * @param res
 * @returns {Promise<*>}
 */
const callback = async function (req, res) {
    let { key, hash, size, bucket, name, info, imageAve, mimeType, ext, uuid, space, remark } = req.body
    let color = imageAve.RGB.replace('0x', '#')
    let { height, width } = info
    let url = domain + key

    // space = space || common.ENUMERATE.ImgEnum.ALL
    if (imgSpaces.indexOf(space) === -1) {
        space = common.ENUMERATE.ImgEnum.ALL
    }
    let values = {
        key, hash, size, bucket, name, height, width, color, mimeType, ext, uuid, url, space, remark
    }
    try {
        values = await resourceDao.create(values)
        log.create(req, values)
        return res.status(200).json(Result.success(values))
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') { // 重复了，返回实例
            let result = await resourceDao.findOne({ where: { hash } })
            return res.status(200).json(Result.success(result))
        }
        log.error('callback error by :', e)
        return res.status(200).json(Result.error())
    }
}

// function detectImageUrl (url) {
//
// }
let detectFlag = false
let detectData = []
let detectTotal = 0
let detectRate = 0
let detectIndex = 0
function $$resetFlag () {
    detectRate = detectTotal = detectIndex = 0
    detectData = []
    log.trace('成功重置探测标识，等待下次探测')
}

async function $$fetchImagesContent () {
    let result = await resourceDao.findAll()
    detectFlag = true
    detectTotal = result.length
    for (let i = 0; i < detectTotal; i++) {
        let image = result[i]
        detectRate++
        try {
            await utils.getURLJSONData(image.url)
            let j = image.toJSON()
            j.type = '404'
            detectData.push(j)
        } catch (e) { // 转换json 失败 说明文件正常
            log.trace('图片 %s 访问正常', image.url)
        }
    }
    detectFlag = false
}
const getDetectData = function (req, res) {
    let count = parseInt(req.query.count)
    log.trace('用户第 %s 次轮询获取', count)
    if (count === 1) {
        log.trace('用户第 1 次轮询获取, 重置数据标识位 detectIndex = 0')
        detectIndex = 0
    }
    // 标志结束，并且数据也取完了
    if (!detectFlag && detectIndex === detectTotal) {
        return res.status(200).json(Result.info(detectData, '探测已经结束'))
    }

    let failNotFound = detectData.slice(detectIndex)
    detectIndex = failNotFound.length > 0 ? detectIndex + failNotFound.length : detectIndex
    return res.status(200).json(Result.success({
        data: failNotFound,
        total: detectTotal,
        rate: detectRate / detectTotal * 100
    }))
}

const detect = async function (req, res, next) {
    try {
        if (detectFlag) {
            // let failNotFound = detectData.splice(-1)
            log.trace('探测正在进行中')
            return res.status(200).json(Result.info('探测已经进行'))
        } else {
            /* */
            // 对结果缓存
            if (detectRate === detectTotal && detectTotal !== 0) {
                log.trace('探测已经结束，在未对结果进行操作前，将一直返回缓存')
                return res.status(200).json(Result.success(detectData))
            }
            log.trace('开始探测，清空探测缓存，重置标识位')
            $$resetFlag()
            $$fetchImagesContent().then(() => {})
            return res.status(200).json(Result.success())
        }
        // 引用计数统计
    } catch (e) {
        log.error('detect error by :', e)
        return res.status(200).json(Result.error())
    }
}

/**
 * 同步七牛图片
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const syncQiniu = async function (req, res, next) {
    let images = await qiniuApi.getAllBybucket(BUCKET_NAME)
    // 图片较多， 优化
    // SELECT HASH FROM j_resource
    // let result = await resourceDao.findAll()
    let result = await sequelize.query('SELECT hash FROM j_resource', { type: sequelize.QueryTypes.SELECT })
    log.trace('本地已有图片个数 %d, 服务器上获取图片数 %d', result.length, images.length)
    let notExistImages = differenceBy(images, result, 'hash')
    log.trace('待同步个数 %d', notExistImages.length)
    try {
        for (let i = 0; i < notExistImages.length; i++) {
            await handleImage(notExistImages[i], req)
        }
        return res.status(200).json(Result.success())
    } catch (e) {
        log.error('syncQiniu error by :', e)
        return res.status(200).json(Result.error())
    }
}
// 抓取网络的图片
const sisyphus = [
    check('url').isURL().withMessage('请提交正确url'),
    checkSpace,
    common.validationResult,
    async function (req, res, next) {
        let { url, copyright, space } = req.body
        try {
            // 抓取
            let image = await qiniuApi.sisyphusFetch(url, null, copyright)
            image.space = space
            // 同步本地
            let source = await handleImage(image, req)
            return res.status(200).json(Result.success(source))
        } catch (e) {
            log.error('sisyphus error by :', e)
            return res.status(200).json(Result.error())
        }
    }
]

router.route('/token')
    .get(token)

router.route('/list')
    .get(list)

router.route('/detect')
    .post(detect)
    .get(getDetectData)

router.route('/sync')
    .get(syncQiniu)

router.route('/move')
    .post(move)

router.route('/del')
    .post(del)

router.route('/sisyphus/fetch')
    .post(sisyphus)

router.route('/callback')
    .post(callback)

module.exports = router
