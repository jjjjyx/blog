'use strict';


const debug = require('debug')('app:utils:' + process.pid);
const Promise = require('bluebird')
const Redis = require('ioredis');
const JWTR =  require('jwt-redis');
const _ = require("lodash")


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


module.exports.create = create