'use strict'


const _ = require('lodash')
const isArray = require('lodash/isArray')
const isString = require('lodash/isString')
const difference = require('lodash/difference')
const differenceBy = require('lodash/differenceBy')
const express = require('express')
const qiniu = require('qiniu')
const Color = require('color')
const uuidv1 = require('uuid/v1')
const UrlParse = require('url')
const path = require('path')

const debug = require('debug')('app:routers:api.qiniu-file')
const log = require('log4js').getLogger('api.qiniu-file')
const {check} = require('express-validator/check')
const {sanitizeQuery} = require('express-validator/filter')

const {resourceDao, sequelize} = require('../../models/index')
const Result = require('../../common/resultUtils')
const {Enum} = require('../../common/enum')
const {getURLJSONData} = require('../common')
const utils = require('../../utils')

const router = express.Router()
const imgSpaces = Object.values(Enum.ImgEnum)
const Op = sequelize.Op
const domain = config.qiUpload.Domain
const BUCKET_NAME = config.qiUpload.BUCKET_NAME
const returnBody = `
{
    "key":$(key),
    "hash":$(etag),
    "size":$(fsize),
    "bucket":"$(bucket)",
    "name":"$(x:name)",
    "info":$(imageInfo),
    "imageAve":$(imageAve),
    "exif": $(exif),
    "mimeType": $(mimeType),
    "ext": $(ext),
    "uuid": $(uuid),
    "space": $(x:space),
    "remark": $(x:remark),
}
`
const qiniuOption = {
    scope: BUCKET_NAME,
    expires: 600, // 10 分钟
    returnBody: returnBody,
    detectMime: 1,
    callbackHost: 'www.mbdoge.cn',
    callbackUrl: 'http://119.29.91.78:3878/api/img/callback',
    callbackBody: returnBody,
    callbackBodyType: 'application/json'
    // saveKey: '$(et)'
}
const mac = new qiniu.auth.digest.Mac(config.qiUpload.ACCESS_KEY, config.qiUpload.SECRET_KEY)
const putPolicy = new qiniu.rs.PutPolicy(qiniuOption)

let qiniuConfig = new qiniu.conf.Config()
//config.useHttpsDomain = true;
qiniuConfig.zone = qiniu.zone.Zone_z2

const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConfig)

const syncDelete = function (keys) {
    let deleteOperations = keys.map((key) => qiniu.rs.deleteOp(BUCKET_NAME, key))
    return new Promise((resolve, reject) => {
        bucketManager.batch(deleteOperations, function (err, respBody, respInfo) {
            if (err) {
                reject(err)
            } else {
                // console.log(respInfo , respBody)
                if (respInfo.statusCode === 298) { // 部分成功
                    let failKey = []
                    respBody.forEach((item, index) => {
                        if (!(item.code === 200 || item.code === 612)) { // 资源不存在，或者删除成功 ，资源部存在的可能在别处删除了 这里也视为删除成功
                            failKey.push(keys[index])
                        }
                    })
                    resolve(failKey)
                } else if (respInfo.statusCode === 200 || respInfo.statusCode === 612) {
                    resolve()
                } else {
                    reject(new Error(respBody.error))
                }
            }
        })
    })
}
async function handleImage (image) {
    let {key, hash, fsize, mimeType, putTime, type, status, remark, space = Enum.ImgEnum.ALL} = image
    let url = domain + key
    let color = await getImageAveByUrl(url)
    color = color.replace('0x', '#')
    let {width, height, format: ext} = await getImageInfo(url)
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

function getAllBybucket (bucket, marker = '') {
    return new Promise((resolve, reject) => {
        let options = {
            limit: 999,
            prefix: '',
            marker
        }
        bucketManager.listPrefix(BUCKET_NAME, options, function (err, respBody, respInfo) {
            if (err) {
                console.log(err)
                throw err
            }
            if (respInfo.statusCode === 200) {
                let items = respBody.items
                let nextMarker = respBody.marker
                if (nextMarker) {
                    getAllBybucket(bucket, nextMarker).then((result) => {
                        resolve(items.concat(result))
                    }).catch((e) => {
                        reject(e)
                    })
                } else {
                    resolve(items)
                }

                // items.forEach(function(item) {
                //     console.log(item.key);
                //     // console.log(item.putTime);
                //     // console.log(item.hash);
                //     // console.log(item.fsize);
                //     // console.log(item.mimeType);
                //     // console.log(item.endUser);
                //     // console.log(item.type);
                // });
            } else {
                reject(new Error(respBody))
                // console.log(respInfo.statusCode);
                // console.log(respBody);
            }
        })
    })
}

/**
 * 获取图片平均色调
 * @see https://developer.qiniu.com/dora/manual/1268/image-average-hue-imageave
 * @param url
 */
async function getImageAveByUrl (url) {
    let data = await getURLJSONData(url + '?imageAve')
    return data.RGB || ''
}

/**
 * 获取图片基本信息 高宽
 * @see https://developer.qiniu.com/dora/manual/1269/pictures-basic-information-imageinfo
 * @param url
 */
async function getImageInfo (url) {
    let data = await getURLJSONData(url + '?imageInfo')
    if (data.error) {
        return {'size': 0, 'format': '', 'width': 0, 'height': 0, 'colorModel': ''}
    }
    return data
}

/**
 *
 * @param url 图片资源
 // * @param name 图片名称
 * @param copyright 版权信息
 * @returns {Promise<void>}
 */
function sisyphusFetch (url, name, copyright) {
    let {host, pathname} = UrlParse.parse(url)
    // url 不正确
    if (!host) throw new Error('url 不正确，无法被解析')
    name = name || path.basename(pathname)
    copyright = copyright || `From the network: ${url}`
    return new Promise((resolve, reject) => {
        bucketManager.fetch(url, BUCKET_NAME, name, function(err, respBody, respInfo) {
            if (err) { //478
                debug('抓取网络图片失败图片失败 url = %s, name', url, name)
                reject(err)
            } else {
                if (respInfo.statusCode === 200) {
                    respBody.remark = copyright
                    // respBody.space = Enum.ImgEnum.COVER
                    respBody.putTime = (+new Date()) / 1000
                    resolve(respBody)
                    // console.log(respBody.key);
                    // console.log(respBody.hash);
                    // console.log(respBody.fsize);
                    // console.log(respBody.mimeType);
                } else {
                    reject(new Error(respBody))
                }
            }
        })
    })
}


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

/**
 * 上传token
 * @type {Function[]}
 */
const token = [
    async function (req, res) {
        res.header('Cache-Control', 'max-age=0, private, must-revalidate')
        res.header('Pragma', 'no-cache')
        res.header('Expires', 0)
        let token = putPolicy.uploadToken(mac)

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
    utils.validationResult,
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
    check('key').exists(),
    utils.validationResult,
    async function (req, res, next) {
        let {space} = req.body
        let {keys} = req.body
        if (!isArray(keys)) {
            keys = [keys]
        }
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
    // utils.validationResult,
    async function (req, res) {
        // let key = req.body.key
        let {keys} = req.body
        if (!isArray(keys)) {
            keys = [keys]
        }
        debug(`删除空间文件 key = `, keys)
        try {
            let failKey = await syncDelete(keys)
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

const callback = [
    async function (req, res) {
        // {
        //     "key":"FhLm2F4r8Njh7Al50LSEYfD8Z49r",
        //     "hash":"FhLm2F4r8Njh7Al50LSEYfD8Z49r",
        //     "size":2286,
        //     "bucket":"jyximg",
        //     "name":"null",
        //     "info":{"colorModel":"nrgba","format":"png","height":252,"size":2286,"width":316},
        //     "imageAve":{"RGB":"0x6c6f70"},
        //     "exif": null,
        //     "mimeType": "image/png"
        //     "ext": null,
        //     "uuid": "c1cba196-4533-46ff-98fb-bb1f15849b8d"
        // }

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
]

function detectImageUrl (url) {

}


const detect = async function (req, res, next) {
    // 获取全部资源
    // todo 探测比较慢 临时写几个测试用
    // {
    //     where: {
    //         hash: ['Fg5Rt_GF1zdn-ph_Nfr4CT7J8Fvi','Fg8yOQDNGye2zcAIhYH8OQBv7oXC', 'FgaPkbw_VxB9hSjsMiDWzdYRccGY', 'FglabNLND9aqVkgfVypjXQJqGVQx']
    //     }
    // }
    try {
        let result = await resourceDao.findAll(

        )
        let failNotFound = []
        // let fail = {
        //     404: failNotFound
        // }
        // 对每个图片访问测试，
        for (let i = 0; i < result.length; i++) {
            let image = result[i]
            try {
                await getURLJSONData(image.url)
                let j = image.toJSON()
                j.type = '404'
                failNotFound.push(j)
            } catch (e) { // 转换json 失败 说明文件正常
                debug('图片 %s 访问正常', image.url)
            }
        }
        // 引用计数统计

        // console.log(failNotFound)
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
    let images = await getAllBybucket(BUCKET_NAME)
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
    utils.validationResult,
    async function (req, res, next) {
        let {url, copyright, space} = req.body
        try{
            // 抓取
            let image = await sisyphusFetch(url, null, copyright)
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
