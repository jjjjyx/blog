'use strict'

const debug = require('debug')('app:routers')
const log = require('log4js').getLogger('routers')
const expressJwt = require('express-jwt')
const guard = require('express-jwt-permissions')()
const unless = require('express-unless')
// const _ = require("lodash");
// const paths = [
//     '/',
//     '/p',
//     '/comment',
//     '/category',
//     '/archives',
//     '/author',
//     '/bg/admin'
// ]
const unless_path = {
    path: ['/api/user/login', '/api/img/callback', '/api/tools/qinfo', '/api/comment/write-user'],
    method: 'OPTIONS'
}
// debug('创建身份验证中间件，并设置 req.user')
log.debug('创建身份验证中间件，并设置 req.user')
const jwtCheck = expressJwt({
    secret: config.secret,
    getToken: function fromHeaderOrQuerystring (req) {
        if (req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1]
        }
        return null
    }
})
jwtCheck.unless = unless

module.exports = function (app) {
    app.use('/', require('./home.js'))
    app.use('/article', require('./article.js'))
    app.use('/category', require('./category.js'))
    app.use('/tags', require('./tags.js'))
    app.use('/archives', require('./archives.js'))
    app.use('/about', require('./about.js'));
    app.use('/jyx-admin', guard.check('admin'), require('./admin.js'))
    // 指定权限验证路径
    // /api 下全是需要登录才可以访问

    app.use('/api/tools', require('./api/tools.js'))

    app.use('/api', jwtCheck.unless(unless_path))
    // app.use("/api",middleware.unless(unless_path))
    app.use('/api/user', require('./api/user.js'))
    app.use('/api/comment', guard.check('comment').unless({path: '/api/comment/write-user'}), require('./api/comment.js'))
    // 后面的需要管理员
    app.use('/api', guard.check('admin').unless(unless_path))
    app.use('/api/post', require('./api/posts.js'))
    app.use('/api/site', require('./api/site.js'))
    app.use('/api/term', require('./api/term.js'))
    app.use('/api/img', require('./api/qiniu-file.js'))

}
