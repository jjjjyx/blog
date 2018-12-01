const log4js = require('log4js')

log4js.configure({
    appenders: {
        access: {
            'type': 'dateFile',
            'filename': 'http-access.log',
            'pattern': '.yyyy-MM-dd',
            'compress': true
        },
        operation: {
            'type': 'dateFile',
            'filename': 'operation.log',
            'pattern': '.yyyy-MM-dd',
            'compress': true
        },
        out: {type: 'stdout'},
        app: {
            type: 'file',
            filename: 'application.log',
            'maxLogSize': 2097152, // 2M
            'numBackups': 3 // 备份 3 个
        }
    },
    categories: {
        http: {appenders: ['access'], level: 'info'},
        op: {appenders: ['out', 'operation'], level: 'debug'},
        default: {appenders: ['out', 'app'], level: 'debug'}
    }
})
const logger = require('../src/common/manageLog')('routers:home')

// const logger = log4js.getLogger('abc.xx')

console.log(logger)
logger.trace('Entering cheese testing')
logger.debug('Got cheese.')
logger.info('Cheese is Comté.')
logger.warn('Cheese is quite smelly.')
logger.error('Cheese is too ripe!')
logger.fatal('Cheese was breeding ground for listeria.')
