'use strict'

const isString = require('lodash/isString')
const difference = require('lodash/difference')
const differenceBy = require('lodash/differenceBy')
const express = require('express')

const Color = require('color')
const uuidv1 = require('uuid/v1')

const debug = require('debug')('app:routers:api.qiniu-file')
const log = require('log4js').getLogger('api.qiniu-file')
const {check} = require('express-validator/check')
const {sanitizeQuery} = require('express-validator/filter')

const {resourceDao, sequelize} = require('../../models/index')
const Result = require('../../common/result')
const {Enum} = require('../../common/enum')
const common = require('../../common/common')
const utils = require('../../utils')
const qiniuApi = require('../../qiniuApi')

const router = express.Router()
const imgSpaces = Object.values(Enum.ImgEnum)
const Op = sequelize.Op
const domain = config.qiUpload.Domain
const BUCKET_NAME = config.qiUpload.BUCKET_NAME
const size = 100
const allowSpace = Object.values(Enum.ImgEnum)
const sanitizeSpace = sanitizeQuery('space')
    .customSanitizer((value) => {
        debug(`sanitizeSpace v = ${value}`)
        if (allowSpace.indexOf(value) === -1) {
            return Enum.ImgEnum.ALL
        } else {
            return value
        }
    })
let checkAllowSpace = ['public', 'cover', 'post', 'avatar']
const checkSpace = check('space').isIn(allowSpace)

async function handleImage (image) {
    let {key, hash, fsize, mimeType, putTime, type, status, remark, space = Enum.ImgEnum.ALL} = image
    let url = domain + key
    let color = await qiniuApi.getImageAveByUrl(url)
    color = color.replace('0x', '#')
    let {width, height, format: ext} = await qiniuApi.getImageInfo(url)
    let uuid = uuidv1()
    let values = {
        key,
        hash,
        size: fsize,
        bucket: BUCKET_NAME,
        name :key, // 这里获取到都是没有文件名称了 使用key 做文件名
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
        {where: {hash} , defaults: values}
    ).spread((img, created) => {
        if (created) {
            // 同步图片
            log.info('同步图片 key = %s, url = %s', hash, url)
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

        if (token) {
            return res.status(200).json(Result.success(token))
        } else {
            return res.status(200).json(Result.info('获取token失败'))
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
        let {page, space, hash, color} = req.query
        log.info('查询获取图片列表： query = ', JSON.stringify(req.query))
        page = page || 1
        let where = {}
        if (space !== Enum.ImgEnum.ALL) {
            where.space = space
        }

        if (hash && isString(hash)) {
            where[Op.or] = []
            where[Op.or].push({hash: {[Op.like]: `%${hash}%`}})
            where[Op.or].push({name: {[Op.like]: `%${hash}%`}})
        }
        try {
            let result = await resourceDao.findAll({
                where,
                limit: size,
                offset: (page - 1) * size,
                order: ['hash']
            })
            // 筛选颜色
            // Color
            try {
                let c1 = Color(color)
                result = result.filter((item) => c1.contrast(Color(item.color)) < 3)
            } catch (e) {
                debug('转换颜色失败 color = ', color)
            }

            return res.status(200).json(Result.success(result))
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
        let {space, keys} = req.body
        debug(`移动空间文件 key = %s， space = %s`, keys, space)
        try {
            await resourceDao.update({space}, {
                where: {hash: keys}
            })
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
        let {keys} = req.body
        debug(`删除空间文件 key = `, keys)
        try {
            let failKey = await qiniuApi.syncDelete(keys)
            // 去掉失败的key
            let successKey = difference(keys, failKey)
            await resourceDao.destroy({
                paranoid: false,
                force: true,
                where: {hash: successKey}
            })
            return res.status(200).json(Result.success({fail: failKey}))
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
const callback =  async function (req, res) {
    let {key, hash, size, bucket, name, info, imageAve, mimeType, ext, uuid, space, remark} = req.body
    let color = imageAve.RGB.replace('0x', '#')
    let {height, width} = info
    let url = domain + key

    // space = space || Enum.ImgEnum.ALL
    if (imgSpaces.indexOf(space) === -1) {
        space = Enum.ImgEnum.ALL
    }
    let values = {
        key, hash, size, bucket, name, height, width, color, mimeType, ext, uuid, url, space, remark
    }
    try {
        values = await resourceDao.create(values)
        return res.status(200).json(Result.success(values))
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') { // 重复了，返回实例
            let result = await resourceDao.findOne({where: {hash}})
            return res.status(200).json(Result.success(result))
        }
        log.error('callback error by :', e)
        return res.status(200).json(Result.error())
    }
}


function detectImageUrl (url) {

}


const detect = async function (req, res, next) {
    try {
        let result = await resourceDao.findAll()
        let failNotFound = []
        for (let i = 0; i < result.length; i++) {
            let image = result[i]
            try {
                await utils.getURLJSONData(image.url)
                let j = image.toJSON()
                j.type = '404'
                failNotFound.push(j)
            } catch (e) { // 转换json 失败 说明文件正常
                debug('图片 %s 访问正常', image.url)
            }
        }
        // 引用计数统计
        return res.status(200).json(Result.success(failNotFound))
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
    let result = await sequelize.query('SELECT hash FROM j_resource', {type: sequelize.QueryTypes.SELECT})
    debug('本地已有图片个数 %d, 服务器上获取图片数 %d', result.length, images.length)
    let notExistImages = differenceBy(images, result, 'hash')
    debug('待同步个数 %d', notExistImages.length)
    try {
        for (let i = 0; i < notExistImages.length; i++) {
            await handleImage(notExistImages[i])
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
        let {url, copyright, space} = req.body
        try{
            // 抓取
            let image = await qiniuApi.sisyphusFetch(url, null, copyright)
            image.space = space
            // 同步本地
            let source = await handleImage(image)
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
    .get(detect)

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
