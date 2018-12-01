const log4js = require('log4js')
const unless = require('express-unless')
// const debug = require('debug')('app:express-middleware:log4js')
const log = log4js.getLogger('express-middleware:log4js')
const logMiddleware = log4js.connectLogger(log4js.getLogger('http'), {
    level: 'auto',
    // 这里主要是使用nginx 代理的取不到ip地址， 不知道现在使用 cdn 的方式能不能取到
    //format: (req, res, format) => format(`http - ${req.clientIp} - ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent"`)
})
const unless_path = {
    path: [/^\/(js|css|fonts)\/.+/g, '/favicon.ico']
}
log.trace('创建log4js 中间件，记录所有访问记录，排除所有静态资源 unless = {"path":[/^\\/(js|css|fonts)\\/.+/g,"/favicon.ico"]}', )

logMiddleware.unless = unless
module.exports = logMiddleware.unless(unless_path)
