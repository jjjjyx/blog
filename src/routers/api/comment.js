'use strict'


const _ = require('lodash')
const express = require('express')
const router = express.Router()
const debug = require('debug')('app:routers:api.comment')
const log = require('log4js').getLogger('api.comment')
const utils = require('../../utils')
const Result = require('../../common/resultUtils')
const {siteDao, termDao} = require('../../models/index');
const {body} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')
const common = require('../common')

const comment = [
    function (req, res, next) {
        return res.status(200).json(Result.success())
    }
]

router.route("/").post(comment)

module.exports = router
