const qiniu = require('qiniu')
const http = require('http')
const {Enum} = require('../common/enum')
const config = require('../../config')
const uuidv1 = require('uuid/v1')
// const redisClient = utils.redisClient;

const mac = new qiniu.auth.digest.Mac(config.qiUpload.ACCESS_KEY, config.qiUpload.SECRET_KEY)
const qiniuConfig = new qiniu.conf.Config()
qiniuConfig.zone = qiniu.zone.Zone_z0

const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConfig)
const BUCKET_NAME = config.qiUpload.BUCKET_NAME
const domain = config.qiUpload.Domain

function detectImageUrl (url) {
}

// function getURLJSONData (url) {
//     url = encodeURI(url) // 防止中文
//     return new Promise((resolve, reject) => {
//         http.get(url, resp => {
//             let data = ''
//             // A chunk of data has been recieved.
//             resp.on('data', (chunk) => {
//                 data += chunk
//             })
//
//             // The whole response has been received. Print out the result.
//             resp.on('end', () => {
//                 try {
//                     data = JSON.parse(data)
//                     resolve(data)
//                 } catch (e) {
//                     reject(e)
//                 }
//                 // console.log(JSON.parse(data).explanation);
//             })
//         }).on('error', reject)
//     })
// }

// getURLJSONData('http://image.cdn.mbdoge.cn/17-1-11/75763093-file_1484140871299_166f3.png').then((data)=>{
//     console.log(data)
// }).catch((e)=>{
//     console.log(e)
// })

// handleImage(
//     { key: '7f4b5d30-0bae-11e7-8a6f-d1bda6c7fa7d.png',
//         hash: 'Fup9BlP5HO_9DCPeTMu23PdUaLhb',
//         fsize: 2611,
//         mimeType: 'image/png',
//         putTime: 14898229748814888,
//         type: 0,
//         status: 0 }
// )

// getAllBybucket(BUCKET_NAME).then(items => {
//     // 获取到全部的空间文件
//     // items.forEach(console.log)
//     items.forEach(handleImage)
// })
// (async function () {
//
//
//     // bucketManager.stat(BUCKET_NAME, 'FvQXhxdZEkkP7NgQXnYXHHcrmMcK22', function (err, respBody, respInfo) {
//     //     console.log(err)
//     //     console.log(respBody)
//     //     console.log(respInfo)
//     // })
//
//
//     // let o = await redisClient.hmsetAsync('test', "a",2 ,"ooooo","ddd")
//     // // let o = await redisClient.hincrbyfloat('test', 'c', 1);
//     // // let o = await redisClient.hgetallAsync('test');
//     // console.log(o)
// })();
