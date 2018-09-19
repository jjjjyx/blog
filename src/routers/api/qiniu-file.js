'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:api.qiniu-file')
const log = require('log4js').getLogger('api.qiniu-file')
const {check, validationResult} = require('express-validator/check')
const {resourceDao} = require('../../models/index')
const {sanitizeBody} = require('express-validator/filter')
const Result = require('../../common/resultUtils')
const _ = require('lodash')
const qiniu = require('qiniu')
const {Enum, labels} = require('../../common/enum')
const utils = require('../../utils')
const imgSpaces = Object.values(Enum.ImgEnum)
// const img
const domain = config.qiUpload.Domain
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
    "space": $(x:space)
}
`
const qiniuOption = {
    scope: config.qiUpload.Bucket_Name,
    expires: 600, // 10 分钟
    returnBody: returnBody,
    detectMime: 1,
    callbackHost: 'www.mbdoge.cn',
    callbackUrl: 'http://119.29.91.78:3878/api/img/callback',
    // callbackBody: 'key=$(key)&hash=$(etag)&w=$(imageInfo.width)&h=$(imageInfo.height)',
    callbackBody: returnBody,
    callbackBodyType: 'application/json'
    // saveKey: '$(et)'
}
const mac = new qiniu.auth.digest.Mac(config.qiUpload.ACCESS_KEY, config.qiUpload.SECRET_KEY)
const putPolicy = new qiniu.rs.PutPolicy(qiniuOption)

let qiniu_config = new qiniu.conf.Config()
//config.useHttpsDomain = true;
qiniu_config.zone = qiniu.zone.Zone_z0

const bucketManager = new qiniu.rs.BucketManager(mac, qiniu_config)
const token = [
    // check('ext').isAlpha,
    // check('md5', '账号不可为空且3-6位').isHash('md5').withMessage('请提交文件md5'),
    // check('prefix').isInt(),
    // utils.validationResult,
    async function (req, res) {
        res.header('Cache-Control', 'max-age=0, private, must-revalidate')
        res.header('Pragma', 'no-cache')
        res.header('Expires', 0)
        let token = putPolicy.uploadToken(mac)

        // let {md5, prefix} = req.query
        // if (prefix > imgPrefixs.length) {
        //     prefix = 0
        // }

        // let key = Enum.ImgEnum[imgPrefixs[prefix]] + md5
        // key = qiniu.util.urlsafeBase64Encode(key)

        // ext = _.last(ext.split('/')) || path.extname(name)

        if (token) {
            return res.status(200).json(Result.success(token))
        } else {
            return res.status(200).json(Result.info('获取token失败'))
        }
    }
]

const syncDelete = function (key) {
    return new Promise((resolve, reject) => {
        bucketManager.delete(config.qiUpload.Bucket_Name, key, function (err, respBody, respInfo) {
            if (err) {
                reject(err)
            } else {
                // console.log(respBody, respInfo)
                if (respInfo.statusCode == 200) {
                    resolve()
                } else {
                    reject(new Error(respBody))
                }
            }
        })
    })
}

const syncListPrefix = function (options) {
    return new Promise((resolve, reject) => {
        bucketManager.listPrefix(config.qiUpload.Bucket_Name, options, function (err, respBody, respInfo) {
            if (err) {
                reject(err)
            }
            if (respInfo.statusCode == 200) {
                //如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，
                //指定options里面的marker为这个值
                let nextMarker = respBody.marker
                let commonPrefixes = respBody.commonPrefixes
                // console.log(nextMarker);
                // console.log(commonPrefixes);
                let items = respBody.items
                // items.forEach(function(item) {
                // console.log(item.key);
                // console.log(item.putTime);
                // console.log(item.hash);
                // console.log(item.fsize);
                // console.log(item.mimeType);
                // console.log(item.endUser);
                // console.log(item.type);
                // });
                let data = {
                    items,
                    marker: nextMarker,
                    commonPrefixes: commonPrefixes
                }
                resolve(data)
            } else {
                reject(new Error(respBody))
            }
        })
    })
}

// const list = [
//     // check('prefix').isInt(),
//     utils.validationResult,
//     async function (req, res) {
//         let {prefix} = req.query
//         if (prefix > imgPrefixs.length) {
//             prefix = 0
//         }
//
//         let prefixStr = Enum.ImgEnum[imgPrefixs[prefix]]
//         let marker = req.query.marker || ''
//
//         var options = {
//             limit: 10,
//             prefix: prefixStr,
//             marker
//         }
//         try {
//             let result = await syncListPrefix(options)
//             return res.status(200).json(Result.success(result))
//         } catch (e) {
//             return res.status(200).json(Result.info('获取空间列表失败'))
//         }
//
//     }
// ]

const size = 30

const list = [
    check('page').isInt(),
    async function (req, res) {
        let {page} = req.query
        log.info('查询获取图片列表： query = ', JSON.stringify(req.query))
        page = page || 1
        try {
            let result = await resourceDao.findAll({
                limit: size,
                offset: (page - 1) * size,
                order: ['hash']
            })
            return res.status(200).json(Result.success(result))
        } catch (e) {
            log.error('getMediaAll error by :', e)
            return res.status(200).json(Result.error())
        }
    }
]

const del = [
    sanitizeBody('key').trim(),
    check('key').exists().isString().withMessage('请提交 key !'),
    utils.validationResult,
    async function (req, res) {
        let key = req.body.key
        debug(`删除空间文件 key = [${key}]`)
        try {
            await syncDelete(key)
            return res.status(200).json(Result.success())
        } catch (e) {
            debug(`删除空间文件 key = [${key}] 失败,原因：${e.message}`)
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

        let {key, hash, size, bucket, name, info, imageAve, mimeType, ext, uuid, space} = req.body
        let color = imageAve.RGB.replace('0x', '#')
        let {height, width} = info
        let url = domain + key

        // space = space || Enum.ImgEnum.ALL
        if (imgSpaces.indexOf(space) === -1) {
             space = Enum.ImgEnum.ALL
        }
        let values = {
            key, hash, size, bucket, name, height, width, color, mimeType, ext, uuid, url, space
        }
        try {
            values = await resourceDao.create(values)
            return res.status(200).json(Result.success(values))
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') { // 重复了，返回实例
                let result = await resourceDao.findOne({where: {hash}})
                return res.status(200).json(Result.success(result))
            }
            debug('callback error by :', e.message)
            return res.status(200).json(Result.error())
        }

    }
]

router.route('/token')
    .get(token)

router.route('/list')
    .get(list)

router.route('/del')
    .post(del)

router.route('/callback')
    .post(callback)

module.exports = router
