const qiniu = require('qiniu')
const UrlParse = require('url')
const path = require('path')

const debug = require('debug')('app:routers:api.qiniuApi')
// const log = require('log4js').getLogger('api.qiniuApi')

const utils = require('./utils')

// const domain = config.qiUpload.Domain
const BUCKET_NAME = config.qiUpload.BUCKET_NAME
const returnBody = `{
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
    "remark": $(x:remark)
}`
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
    let data = await utils.getURLJSONData(url + '?imageAve')
    return data.RGB || ''
}

/**
 * 获取图片基本信息 高宽
 * @see https://developer.qiniu.com/dora/manual/1269/pictures-basic-information-imageinfo
 * @param url
 */
async function getImageInfo (url) {
    let data = await utils.getURLJSONData(url + '?imageInfo')
    if (data.error) {
        return { 'size': 0, 'format': '', 'width': 0, 'height': 0, 'colorModel': '' }
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
    let { host, pathname } = UrlParse.parse(url)
    // url 不正确
    if (!host) throw new Error('url 不正确，无法被解析')
    name = name || path.basename(pathname)
    copyright = copyright || `From the network: ${url}`
    return new Promise((resolve, reject) => {
        bucketManager.fetch(url, BUCKET_NAME, name, function (err, respBody, respInfo) {
            if (err) { //478
                debug('抓取网络图片失败图片失败 url = %s, name', url, name)
                reject(err)
            } else {
                if (respInfo.statusCode === 200) {
                    respBody.remark = copyright
                    // respBody.space = common.ENUMERATE.ImgEnum.COVER
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

function uploadToken () {
    return putPolicy.uploadToken(mac)
}

module.exports.syncDelete = syncDelete
module.exports.getAllBybucket = getAllBybucket
module.exports.getImageAveByUrl = getImageAveByUrl
module.exports.getImageInfo = getImageInfo
module.exports.sisyphusFetch = sisyphusFetch
module.exports.uploadToken = uploadToken
