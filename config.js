'use strict'
// module.exports
// const debug = require('debug')('app:config')
const merge = require('lodash/merge')
const log = require('log4js').getLogger('config');
const debug = require('debug')('app:config')
// 启动参数，与site 无关
const CONFIG = {
    appPort: 3878,
    allowOrigin: 'http://localhost:3879',
    maxAge: 365 * 5 * 60000 * 60 * 24,
    cacheTimeOut: 60 * 60 * 24 * 2, // 单位秒  2 天
    secret: '$2a$10$5A/Wb/EnCwdS2Yxdk0ouGe4beJn7ZTpPD9ofzMdaLc45EgIZwURg6',
    tokenPrefix: 'Bearer',
    tokenHeaderKey: 'authorization',
    tokenExpiration: '1 days',
    defaultAvatar: 'https://image.cdn.mbdoge.cn/FuNJUwEY1vEWt5ncFeVXhVG4-R6S',
    db: {
        development: {
            username: 'blog',
            password: 'C9XyX5dWd9CQjHwu',
            database: 'blog',
            host: '127.0.0.1',
            dialect: 'mysql',
            timezone: '+08:00',
            operatorsAliases: false,
            // timestamps: false,
        },
        test: {
            username: 'database_test',
            password: 'test',
            database: 'database_test',
            host: '127.0.0.1',
            dialect: 'mysql'
        },
        production: {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            host: process.env.DB_HOSTNAME,
            dialect: 'mysql',
            //timestamps: false,
            define: {
                charset: 'utf8',
                collate: 'utf8_general_ci',
                timestamps: true
            }
            // dialectOptions: {
            //     ssl: {
            //         ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
            //     }
            // }
        }
    }
}

try {
    let pri = require('./private.js')
    merge(CONFIG, pri)
    log.info('Loading private configuration')
} catch (e) {
    log.info('Failed to load private configuration!')
}
// Object.keys(CONFIG).forEach((key)=> {
//     if (typeof CONFIG[key] !== 'object') {
//         debug(`${key} = ${CONFIG[key]}` )
//     }
// })

module.exports = CONFIG
