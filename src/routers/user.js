'use strict';


const express = require('express');
const bcrypt = require("bcryptjs");
// const jwt = require('express-jwt');
const Redis = require('ioredis');
const JWTR =  require('jwt-redis');

const router = express.Router();
const debug = require("debug")("app:routers:user")
const { check, validationResult } = require('express-validator/check');
const utils = require("../utils")
const userDao = require("../models").users



const login = async function (req, res, next) {
    const errors = validationResult(req);
    let map = { code: 0};
    if (!errors.isEmpty()) {
        map.code = 422
        map.msg = "参数错误"
        map.data = errors.mapped()
        return res.status(422).json(map);
    }
    let {username,password} = req.body
    // 取数据验证

    let user = await userDao.findOne({
        where :{user_login:username}
    })

    if (null===user) {
        map.code = -1
        map.msg = "账号或密码错误"
        return res.status(200).json(map)
    }
    let isMatch  = bcrypt.compareSync(password,user.user_pass)
    if (isMatch) {
        debug("User authenticated, generating token");
        user = user.get({plain: true})

        delete user.user_pass

        let result = await utils.create(user);
        map = { code: 0, msg: "Token generated",data:result}
        return res.status(200).json(map)
        // 获得token
    }
}

let login_check = [
    check('username','账号不可为空且3-6位').isString().withMessage("必须是字符串").isLength({min:3,max:6}),
    check('password', 'passwords must be at least 5 chars long and contain one number')
        .isLength({ min: 5 }),
]

const auth = function (req,res,next){
    console.log(req.user)
    res.send("test")
}

router.route('/login')
    .get((req, res, next) =>res.send('你以为我会放一个登录界面吗?'))
    .post(login_check, login);

router.route("/auth")
    .get(auth)

module.exports = router