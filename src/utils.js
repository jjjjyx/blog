'use strict';


const debug = require('debug')('app:utils:' + process.pid);
const Promise = require('bluebird')
const moment = require("moment")
const Redis = require('ioredis');
const JWTR =  require('jwt-redis');
const _ = require("lodash")
const {validationResult} = require('express-validator/check')
const Result = require('./common/resultUtils')

const TOKEN_EXPIRATION = 60; // 单位秒
// 5天
const TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60*24*5;
// const TOKEN_EXPIRATION_SEC = 10;

const {secret} = config
let redis = new Redis();
let jwtr = new JWTR(redis);
Promise.promisifyAll(jwtr);
// Promise.p



async function create(obj,expiresIn = TOKEN_EXPIRATION_SEC){

    if (_.isEmpty(obj)) throw new Error('Data cannot be empty.');

    debug("Create token");

    let token = await jwtr.signAsync(obj,secret,{expiresIn: expiresIn})

    debug("Token generated for user: %s, token: %s", obj.user_login, token);

    return token

}

const x="0123456789qwertyuioplkjhgfdsazxcvbnm";
module.exports.randomChar = function(l)  {
    var tmp="";
    for(var i=0;i<l;i++)  {
        tmp += x.charAt(Math.ceil(Math.random()*100000000)%x.length);
    }
    return tmp;
}

module.exports.validationResult = function(req, res, next)  {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(200).json(Result.info('参数错误', errors.mapped()))
    }
    return next();
}

module.exports.termReg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/

module.exports.formatDate = function (time) {
    return moment(time).format("YYYY-MM-D hh:mm")
}


module.exports.create = create
