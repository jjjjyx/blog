'use strict'

const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()
const debug = require('debug')('app:routers:user')
const {check, validationResult} = require('express-validator/check')
const utils = require('../utils')
const userDao = require('../models').users
//密码必须为6-18位 必须包含特殊字符和英文
const passReg = new RegExp('^(?![a-zA-z]+$)(?!\\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\\d!@#$%^&*]+$)[a-zA-Z\\d!@#$%^&*]+$')

const login = [
	check('username', '账号不可为空且3-6位').isString().withMessage('必须是字符串').isLength({min: 3, max: 6}),
	check('password', '密码为6-18位').isString().withMessage('必须是字符串')
		.isLength({min: 6, max: 18}),
	async function (req, res, next) {
		const errors = validationResult(req)
		let map = {code: 0}
		if (!errors.isEmpty()) {
			map.code = 422
			map.msg = '参数错误'
			map.data = errors.mapped()
			return res.status(422).json(map)
		}
		let {username, password} = req.body
		// 取数据验证
		
		let user = await userDao.findOne({
			where: {user_login: username}
		})
		
		if (null === user) {
			map.code = -1
			map.msg = '账号或密码错误'
			return res.status(200).json(map)
		}
		let isMatch = bcrypt.compareSync(password, user.user_pass)
		if (isMatch) {
			debug('User authenticated, generating token')
			user = user.get({plain: true})
			
			delete user.user_pass
			delete user.id
			let result = await utils.create(user)
			map = {code: 0, msg: 'Token generated', data: result}
			return res.status(200).json(map)
			// 获得token
		}
	}
]

const auth = function (req, res, next) {
	// console.log(req.user)
	// res.send("test")
	// delete req.user.id;
	// console.log(req.user)
	return res.status(200).json({
		code: 0,
		data: req.user
	})
}

const update_info = [
	
	function (req, res, next) {
	
	}
]
// console.log(check('c_pass','2次密码不一致'))
//"密码强度不够"
const update_pass = [
	check('old_pass', '原始密码不可为空').isString().isLength({min: 6, max: 18}),
	check('new_pass', '新密码不可为空').isString().isLength({
		min: 6,
		max: 18
	}).withMessage('密码长度在6-18').matches(passReg).withMessage('密码强度不够'),
	check('cpass', '确认密码不可为空').isString().isLength({
		min: 6,
		max: 18
	}).withMessage('密码长度在6-18').matches(passReg).withMessage('密码强度不够'),
	async function (req, res, next) {
		const errors = validationResult(req)
		let map = {code: 0}
		if (!errors.isEmpty()) {
			map.code = 422
			map.msg = '参数错误'
			map.data = errors.mapped()
			return res.status(422).json(map)
		}
		let {old_pass, new_pass, cpass} = req.body
		
		if (new_pass !== cpass) {
			map.code = -1
			map.msg = '2次密码不一致'
			return res.status(200).json(map)
		}
		let {user_login} = req.user
		let user = await userDao.findOne({
			where: {user_login}
		})
		let isMatch = bcrypt.compareSync(old_pass, user.user_pass)
		
		if (isMatch) {
			debug(`update user ${user_login} pass`)
			user.user_pass = bcrypt.hashSync(new_pass)
			user.save()
			
			map.code = 0
			map.msg = '修改成功'
		} else {
			map.code = -1
			map.msg = '密码错误'
		}
		return res.status(200).json(map)
	}
]

router.route('/login')
	.get((req, res, next) => res.send('你以为我会放一个登录界面吗?,不存在的！'))
	.post(login)

router.route('/auth')
	.get(auth)

router.route('/update/info')
	.post(update_info)

router.route('/update/pass')
	.post(update_pass)

module.exports = router