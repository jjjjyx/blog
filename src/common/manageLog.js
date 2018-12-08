
const log4js = require('log4js')
const isEmpty = require('lodash/isEmpty')
const isObject = require('lodash/isObject')
const groupBy = require('lodash/groupBy')

const ENUMERATE = require('./enumerate')
const CONSTANT = require('./constant')
const utils = require('../utils')

const _empty = () => ''

const $dataToContent = {
    change: (values) => {
        let str = ''
        if (!isEmpty(values)) {
            str += '{'
            str += Object.keys(values).map((key) => {
                let label = ENUMERATE.fieldLabelEnum[key] || key
                let value = values[key]
                if (value instanceof Array) {
                    if (value.length === 1) {
                        return `${label}=>${value[0]}`
                    } else {
                        return `${label}:(${value[0]} => ${value[1]})`
                    }
                } else {
                    return `${label} => ${value}`
                }
            }).join(', ')
            str += '}'
        }
        return str
    },
    // create: (values, mop, rt) => values.map((value) => $operationByType[Object.prototype.toString.apply(value)](value, mop, rt)).join(', '),
    dataList: (values = [], mop, rt = '') => {
        return values.map((relatedObject) => {
            let relatedTargetType = relatedObject.constructor.name
            let $relatedTargetFn = $relatedTargetToStr[relatedTargetType]
            if (typeof $relatedTargetFn !== 'function') {
                return ''
            }
            return (rt || ENUMERATE.relatedTypeEnum[relatedTargetType] || relatedTargetType) + ':' + $relatedTargetFn(relatedObject)
        }).join(', ')
    },
    pks: (values = [], mop, rt) => {
        return values.map((relatedObject) => {
            if (isObject(relatedObject)) {
                let relatedTargetType = relatedObject.constructor.name
                let $relatedTargetFn = $relatedTargetToStr[relatedTargetType]
                if (typeof $relatedTargetFn !== 'function') {
                    return ''
                }
                return $relatedTargetFn(relatedObject)
            } else {
                return '#' + relatedObject
            }
        }).join(', ')
    }
}

const $relatedTargetToStr = {
    comment: CONSTANT.COMMENT_TO_STRING,
    term: CONSTANT.TERM_TO_STRING,
    user: CONSTANT.USER_TO_STRING,
    post: CONSTANT.POST_TO_STRING,
    site: CONSTANT.SITE_TO_STRING,
    resource: CONSTANT.RESOURCE_TO_STRING,
    userMeta: _empty,
    userLog: _empty,
    commentMeta: _empty,
    postMeta: _empty,
    read: _empty,
    visitor: _empty
}

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
     // 一个对象
     用户${user} 修改${什么} ${value1}:(${old}=>${new}) ${value2}=>(${old}=>${new})
     // 多个对象修改一个属性
     用户${user} 修改${什么} target=[x#x, ] ${value1}=${new})
     用户${user} 登陆
     用户${user} 退出
     用户${user} 上传${什么} ${url}
     xx 访问网站
     xx 访问文章 xx
     xx 评论 文章 ${title}
     xx 回复 用户
     */
    $base (req, operation, relatedType = '', relatedObject, data = {}) {
        let content = ''
        let dataStr
        if (relatedObject) {
            let relatedTargetType = relatedObject.constructor.name
            let $relatedTargetFn = $relatedTargetToStr[relatedTargetType]
            if (typeof $relatedTargetFn !== 'function') {
                return this.log.error('请基于数据库模型记录操作日志, 错误的类型=%s 操作=%s', relatedTargetType, operation, new Error('Wrong operation object'))
            }
            relatedType = relatedType || ENUMERATE.relatedTypeEnum[relatedTargetType] || relatedTargetType
            content = $relatedTargetFn(relatedObject)
        // } else {
        }
        dataStr = Object.keys(data).map((key) => $dataToContent[key](data[key], operation, relatedType)).join(' ')
        let who = this.$getWho(req)
        this.opLog.info(`%s %s%s %s%s`, who, operation, relatedType, content, dataStr)
    }

    $getWho (req) {
        let who
        let user = req.user
        if (user) {
            who = CONSTANT.USER_TO_STRING(user)
        } else {
            who = ENUMERATE.whoTypeEnum.visitor + '_' + req.cookies[CONSTANT.VISITOR_KEY]
        }
        return who
    }

    // end
    login (req) {
        this.$base(req, ENUMERATE.manageOperationEnum.LOGIN, ENUMERATE.relatedTypeEnum.system)
    }

    logout (req) {
        this.$base(req, ENUMERATE.manageOperationEnum.LOGOUT, ENUMERATE.relatedTypeEnum.system)
    }

    create (req, relatedObject, relatedType) {
        this.$base(req, ENUMERATE.manageOperationEnum.CREATE, relatedType, relatedObject)
    }

    creates (req, values = [], relatedType) {
        this.$base(req, ENUMERATE.manageOperationEnum.CREATE, relatedType, null, { dataList: values })
    }
    // 多个对象 的同一个属性修改  不展示旧值，只展示新值
    $change (req, values, key, value, rt) {
        let o = {
            change: {
                [key]: [value]
            },
            dataList: values
        }
        this.$base(req, ENUMERATE.manageOperationEnum.UPDATE, rt, null, o)
    }

    // 单个对象 的多个属性修改  展示每个属性的新旧值
    /**
     *
     * @param req
     * @param relatedObject 修改的对象 一般是models
     * @param oldObj 旧值
     * @param newObj 新值
     * @param relatedType 可选参数
     */
    update (req, relatedObject, oldObj, newObj, relatedType) {
        let change = utils.difference(oldObj, newObj)
        this.$base(req, ENUMERATE.manageOperationEnum.UPDATE, relatedType, relatedObject, { change })
    }

    changeImageSpace (req, values, value) {
        this.$change(req, values, 'space', value, ENUMERATE.relatedTypeEnum.image)
    }

    updatePostTerm (req, post, oldTerms, newTerms) {
        let { category: oldCategory = [{}] } = groupBy(oldTerms, 'taxonomy')
        let { category: newCategory = [{}], post_tag: newPostTag } = groupBy(newTerms, 'taxonomy')
        let change = {}
        oldCategory = oldCategory[0]
        newCategory = newCategory[0]

        if (oldCategory.id !== newCategory.id) {
            change['category'] = [CONSTANT.TERM_TO_STRING(oldCategory), CONSTANT.TERM_TO_STRING(newCategory)]
        }
        if (newPostTag) {
            change['post_tag'] = newPostTag.map(CONSTANT.TERM_TO_STRING).join(', ')
        }
        if (isEmpty(change)) {
            return ''
        }
        this.$base(req, ENUMERATE.manageOperationEnum.UPDATE, ENUMERATE.relatedTypeEnum.term, post, { change })
    }

    publishPost (req, relatedObject, oldObj, newObj) {
        let who = this.$getWho(req)
        let change = utils.difference(oldObj, newObj)
        let $relatedTargetFn = $relatedTargetToStr.post
        delete change.post_content
        delete change.post_excerpt
        let contentDiff = $dataToContent.change(change)

        // let content = Object.keys(value).map((key) => valueToContent[key](value[key], mop, rt)).join(' ')
        this.opLog.info(`%s %s%s%s %s`, who, ENUMERATE.manageOperationEnum.PUBLISH, ENUMERATE.relatedTypeEnum.post, $relatedTargetFn(relatedObject), contentDiff)
    }

    updatePost (req, relatedObject, oldObj, newObj) {
        let who = this.$getWho(req)
        let change = utils.difference(oldObj, newObj)
        if (isEmpty(change)) {
            return null
        }
        let $relatedTargetFn = $relatedTargetToStr.post
        let postContent = change.post_content
        let postExcerpt = change.post_excerpt
        let contentDiff = ''

        if (postContent) {
            contentDiff += '\n' + utils.createPatch('post_content', ...postContent)
            delete change.post_content
        }
        if (postExcerpt) {
            contentDiff += '\n' + utils.createPatch('post_excerpt', ...postExcerpt)
            delete change.post_excerpt
        }
        contentDiff = $dataToContent.change(change) + contentDiff

        // let content = Object.keys(value).map((key) => valueToContent[key](value[key], mop, rt)).join(' ')
        this.opLog.info(`%s %s%s%s %s`, who, ENUMERATE.manageOperationEnum.UPDATE, ENUMERATE.relatedTypeEnum.post, $relatedTargetFn(relatedObject), contentDiff)
    }

    delete (req, values = [], relatedType) {
        if (!relatedType) {
            return this.log.error('Record deletion log failed Operation object does not exist')
        }
        if (!(values instanceof Array)) {
            values = [values]
        }
        this.$base(req, ENUMERATE.manageOperationEnum.DELETE, relatedType, null, { pks: values })
    }
    trash (req, values = [], relatedType) {
        if (!relatedType) {
            return this.log.error('Logging recycle bin log failed The operation object does not exist')
        }
        if (!(values instanceof Array)) {
            values = [values]
        }
        this.$base(req, ENUMERATE.manageOperationEnum.TRASH, relatedType, null, { pks: values })
    }

    revert (req, values = [], relatedType) {
        if (!relatedType) {
            return this.log.error('Logging recycle bin log failed The operation object does not exist')
        }
        if (!(values instanceof Array)) {
            values = [values]
        }
        this.$base(req, ENUMERATE.manageOperationEnum.REVERT, relatedType, null, { pks: values })
    }
    access (req, target) {

    }
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
