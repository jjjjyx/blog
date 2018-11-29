const log4js = require('log4js')
const unless = require('express-unless')
// nolog: '\\.js$',
const log = log4js.connectLogger(log4js.getLogger('http'), {
    level: 'auto',
    format: (req, res, format) => format(`http - ${req.clientIp} - ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent"`)
})
const unless_path = {
    path: [/^\/(js|css|fonts)\/.+/g, '/favicon.ico']
}

log.unless = unless
module.exports = log.unless(unless_path)
