'use strict';

const fs = require('fs');
const path = require('path');
const common = require('../common/common')
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db_config = require(__dirname + '/../db_config.js')[env];
const db = {};
const prefix = "j_"
// const {db_config: db} = config
// db_config.logging = false
const sequelize = new Sequelize(db_config.database, db_config.username, db_config.password, db_config);

// model 是有关联关系的 不能这样加载
// 需要手动了
let models = [
    'usersModel.js',
    'usersMetaModel.js',
    'commentsModel.js',
    'commentMetaModel.js',
    'postsModel.js',
    'postMetaModel.js',
    'termsModel.js',
    'readsModel.js',
    'termRelationshipsModel.js', // 这个是many to many
    'visitorsModel.js',
    'siteModel.js'
]
models.forEach(file => {
    // console.log(file)
    let model = sequelize['import'](path.join(__dirname, file));
    let name = common.transformStr3(file.substring(prefix.length, file.length - 3)) + 'Dao'
    db[name] = model;
})

// fs.readdirSync(__dirname)
//     .filter(file => {
//         return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//     })
//     .forEach();

// Object.keys(db).forEach(modelName => {
//     if (db[modelName].associate) {
//         db[modelName].associate(db);
//     }
// });
// const {
//     commentsDao,
//     commentMetaDao,
//     postsDao,
//     postMetaDao,
//     readsDao,
//     siteDao,
//     termsDao,
//     termRelationshipsDao,
//     usersDao,
//     userMetaDao,
// } = db
//
// postsDao.belongsTo(usersDao)
// (async function (){

// })


console.log('db', db)

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
