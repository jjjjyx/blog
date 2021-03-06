'use strict'

// const debug = require('debug')('models:' + process.pid)
const log = require('log4js').getLogger('models')
const sqlLog = require('log4js').getLogger('sql')
const path = require('path')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../../config')
// const hooks = require('./hooks')
// const db_config = require(__dirname + '/../db_config.js')[env];
const db_config = config.db[env]
db_config.logging = function (sql) {
    sqlLog.info(sql)
}
const db = {}
const sequelize = new Sequelize(db_config.database, db_config.username, db_config.password, db_config)
// model 是有关联关系的 不能这样加载
// 需要手动了
let models = [
    'usersModel.js',
    'usersMetaModel.js',
    'usersLogModel.js',
    'commentsModel.js',
    'commentMetaModel.js',
    'postsModel.js',
    'postMetaModel.js',
    'termsModel.js',
    'readsModel.js',
    'visitorsModel.js',
    'siteModel.js',
    'resourceModel.js'
    // 'logModel.js'
]
models.forEach(file => {
    let model = sequelize['import'](path.join(__dirname, file))
    // let name = common.transformStr3(file.substring(0, file.length - 8)) + 'Dao'
    let daoName = model.name + 'Dao'
    db[daoName] = model
    log.trace('import %s form %s', daoName, file)
})
db.sequelize = sequelize
db.Sequelize = Sequelize

// let {}
module.exports = db
