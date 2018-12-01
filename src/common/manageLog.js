// class ManageLog {
//
// }
const isEmpty = require('lodash/isEmpty')
// const config = require('../../config')
const ENUMERATE = require('./enumerate')
const CONSTANT = require('./constant')
const utils = require('../utils')

const log4js = require('log4js')
// let {de}
// const defaultAvatar = config.defaultAvatar


//
// function base (req, mop, rt, value = {}) {
//
//     let user = req.user
//     if (user) {
//         value['user_id'] = user.id
//         value['user_nickname'] = user.nickname
//         value['user_display_name'] = user.display_name
//         // value['user_avatar'] = user.avatar
//     } else {
//         value['user_id'] = req.req.cookies[Enum.const.VISITOR_KEY]
//     }
// }

class ManageLog {
    constructor (name) {
        // super('op.' + name)
        this.log = log4js.getLogger(name)
        this.opLog = log4js.getLogger('op.' + name)

    }

    /*
     复制log 的方法 ，这样写有语法提示
     */

    isAllEnabled () {
        return this.log.isAllEnabled()
    }

    all (...args) {
        this.log.all(...args)
    }

    isTraceEnabled () {
        return this.log.isTraceEnabled()
    }

    trace (...args) {
        this.log.trace(...args)
    }

    isDebugEnabled () {
        return this.log.isDebugEnabled()
    }

    debug (...args) {
        this.log.debug(...args)
    }

    isInfoEnabled () {
        return this.log.isInfoEnabled()
    }

    info (...args) {
        this.log.info(...args)
    }

    isWarnEnabled () {
        return this.log.isWarnEnabled()
    }

    warn (...args) {
        this.log.warn(...args)
    }

    isErrorEnabled () {
        return this.log.isErrorEnabled()
    }

    error (...args) {
        this.log.error(...args)
    }

    isFatalEnabled () {
        return this.log.isFatalEnabled()
    }

    fatal (...args) {
        this.log.fatal(...args)
    }

    isMarkEnabled () {
        return this.log.isMarkEnabled()
    }

    mark (...args) {
        this.log.mark(...args)
    }

    isOffEnabled () {
        return this.log.isOffEnabled()
    }

    off (...args) {
        this.log.off(...args)
    }


    /*
	// 谁 做了什么, 参数是
	// value = 关联的值
	WHO_TYPE + MANAGE_OPERATION + RELATED_TYPE + value
		= 显示内容
        用户${user} 创建${什么} ${value}
        用户${user} 修改${什么} ${value1}=>(${old}=>${new}) ${value2}=>(${old}=>${new})
        用户${user} 登陆
        用户${user} 退出
        用户${user} 上传${什么} ${url}
        xx 访问网站
        xx 访问文章 xx
        xx 评论 文章 ${title}
        xx 回复 用户
	*/
    $base (req, mop, rt, content = '') {
        let who
        let user = req.user
        if (user) {
            who = ENUMERATE.whoTypeEnum.USER + user.user_nickname
        } else {
            who = ENUMERATE.whoTypeEnum.visitor + ' ' + req.cookies[CONSTANT.VISITOR_KEY]
        }
        // let str = `${who} `
        this.opLog.info(`%s %s%s %s`, who, mop, rt, content)
    }
    static $formatValue ({change} = {}) {
        let str = '{'
        if (!isEmpty(change)) {
            str += Object.keys(change).map((key) => {
                let label = ENUMERATE.fieldLabelEnum[key] || key
                return `${label}:(${change[key][0]} => ${change[key][1]})`
            }).join(', ')
            str += '}'
        }
        return str
    }

    // end
    login (req) {
        this.$base(req, ENUMERATE.manageOperationEnum.LOGIN, '系统')
    }

    logout (req, ) {
        this.$base(req, ENUMERATE.manageOperationEnum.LOGOUT, '系统')
    }

    updateUserInfo (req, oldObj, newObj) {
        // 要排除一些固定属性
        delete oldObj.updatedAt
        delete newObj.updatedAt

        delete oldObj.metas
        delete newObj.metas
        let diffObj = utils.difference(oldObj, newObj)
        this.$base(req, ENUMERATE.manageOperationEnum.UPDATE, '用户资料', ManageLog.$formatValue({change: diffObj}))
    }

    createCategory (req, id, name) {
        this.$base(req, ENUMERATE.manageOperationEnum.CREATE, '分类', `${id}#${name}`)
    }

    createTag (req, id, name) {
        this.$base(req, ENUMERATE.manageOperationEnum.CREATE, '标签', `${id}#${name}`)
    }

    createPost (req, id, title) {
        this.$base(req, ENUMERATE.manageOperationEnum.CREATE, '文章', `${id}#${title}`)
    }

    access () {}
}

//
// function login (req) {}
//
// function logout () {}
//
// function update () {}
//
// function create () {}
//
// function access () {}

// function access (){}

// 没有语法提示
// function addLevelMethods (target) {
//     const level = log4js.levels.getLevel(target)
//
//     const levelStrLower = level.toString().toLowerCase()
//     const levelMethod = levelStrLower.replace(/_([a-z])/g, g => g[1].toUpperCase())
//     const isLevelMethod = levelMethod[0].toUpperCase() + levelMethod.slice(1)
//
//     ManageLog.prototype[`is${isLevelMethod}Enabled`] = function () {
//         return this.log[`is${isLevelMethod}Enabled`](level)
//     }
//
//     ManageLog.prototype[levelMethod] = function (...args) {
//         this.log[levelMethod](...args)
//     }
//     console.log(
//         `
//         is${isLevelMethod}Enabled () {
//             return this.log.is${isLevelMethod}Enabled()
//         }
//         ${levelMethod} (...args) {
//             this.log.${levelMethod}(...args)
//         }
//         `
//     )
// }

// log4js.levels.levels.forEach(addLevelMethods)

module.exports = function (name) {
    return new ManageLog(name)
}
