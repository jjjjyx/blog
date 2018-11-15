/* jshint indent: 2 */
const {Enum} = require('../common/enum')
// ALTER TABLE `blog`.`j_userlogs` CHANGE `type` `type` ENUM('login','update','logout') CHARSET utf8 COLLATE utf8_bin NULL;
module.exports = function (sequelize, DataTypes) {
    const userMetaModel = sequelize.define('userLog', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        ip: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        action: { // 操作
            type: DataTypes.STRING(200),
            allowNull: false
        },
        agent: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM,
            values: Object.values(Enum.LogType),
        }
    }, {
        tableName: 'j_userlogs',
        timestamps: true,
        // 不想使用 updatedAt
        updatedAt: false,
    });
    const {user: userModel} = sequelize.models
    // const pk = {foreignKey: 'user_id', targetKey: 'id'}
    // userModel.hasMany(userMetaModel, pk)
    // userMetaModel.belongsTo(userModel,pk)
    userModel.hasMany(userMetaModel, {as: 'logs', foreignKey: 'user_id', sourceKey: 'id'})
    return userMetaModel
};
// node ./src/init-db.js
