'use strict'

const express = require('express')

const router = express.Router()
const debug = require('debug')('app:routers:img-upload')
const {check, validationResult} = require('express-validator/check')
const Result = require('../common/resultUtils')
const _ = require('lodash')
const qiniu = require('qiniu')

// qiniu.conf.ACCESS_KEY = C.qiUpload.ACCESS_KEY;
// qiniu.conf.SECRET_KEY = C.qiUpload.SECRET_KEY;

const domain = C.qiUpload.Domain
const uptoken = new qiniu.rs.PutPolicy(C.qiUpload.Bucket_Name)


const token = [
    check('md5', '账号不可为空且3-6位').isHash('md5').withMessage('请提交文件md5'),
    async function (req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            debug('企图上传文件，但是尚未提交md5！')
            return res.status(200).json(Result.info('参数错误', errors.mapped()))
        }
        res.header('Cache-Control', 'max-age=0, private, must-revalidate')
        res.header('Pragma', 'no-cache')
        res.header('Expires', 0)
        let token = uptoken.token()
        let {name, ext, md5} = req.query

        ext = _.last(ext.split('/')) || path.extname(name)

        if (token) {
            let r = {
                token,
                domain,
                key: md5 + '.' + (ext || 'png'),
                uptoken: token
            }
            return res.status(200).json(Result.success(r));
        } else {
            return res.status(200).json(Result.info("获取token失败"));
        }
    }
]

router.route('/token')
    .get(token)

module.exports = router
