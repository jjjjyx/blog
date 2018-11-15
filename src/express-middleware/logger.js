const log4js = require('log4js')

module.exports = log4js.connectLogger(log4js.getLogger('http'), {
    level: 'auto',
    format: (req, res, format) => format(`http - ${req.clientIp} - ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent"`)
})
