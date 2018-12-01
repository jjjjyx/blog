'use strict'

// const debug = require('debug')('app:routers')
const log = require('log4js').getLogger('routers')

const guard = require('express-jwt-permissions')()
const authMiddleware = require('../express-middleware/auth')
const visitorMiddleware = require('../express-middleware/visitor')

const unless_path = {
    path: ['/api/user/login', '/api/img/callback', '/api/tools/qinfo', '/api/site/dict'],
    method: 'OPTIONS'
}

log.trace('载入路由')
module.exports = function (app) {
    app.use('/', visitorMiddleware)
    app.use('/', require('./home.js'))
    app.use('/article', require('./article.js'))
    app.use('/category', require('./category.js'))
    app.use('/tags', require('./tags.js'))
    app.use('/archives', require('./archives.js'))
    app.use('/about', require('./about.js'));
    app.use('/jyx-admin', require('./admin.js'))

    // 不需要登录使用的api
    app.use('/api/tools', require('./api/tools.js'))
    app.use('/api/reply', require('./api/reply.js'))
    // 指定权限验证路径
    // /api 下全是需要登录才可以访问
    // todo 更改验证中间件， 分为2部分，一部分提取， 一部分验证 ，验证可以指定路径，剔除路径
    app.use('/api', authMiddleware.unless(unless_path))
    // app.use("/api",middleware.unless(unless_path))
    app.use('/api/user', require('./api/user.js'))

    app.use('/api/comment', guard.check([['admin'],['comment']]).unless(unless_path), require('./api/comment.js'))
    // 后面的需要管理员
    app.use('/api', guard.check('admin').unless(unless_path))
    app.use('/api/post', require('./api/posts.js'))
    app.use('/api/site', require('./api/site.js'))
    app.use('/api/term', require('./api/term.js'))
    app.use('/api/img', require('./api/qiniu-file.js'))

}
