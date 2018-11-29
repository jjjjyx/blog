/* jshint indent: 2 */
const Enum =require('../common/enumerate')

// 创建文章 ${value}
// 修改${k}${k2}=>(${old}=>${new})
// 用户${user}登陆系统
// 用户${user}退出
// 用户上传图片 ${url}
// xx 访问网站
// xx 访问文章 xx
// xx 评论 文章 ${title}
// xx 回复 文章 ${title}
//

module.exports = function (sequelize, DataTypes) {
    const userMetaModel = sequelize.define('log', {
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
        agent: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        content: { // 操作内容
            type: DataTypes.STRING(500),
            allowNull: false
        },
        operation: { // 操作行为
            type: DataTypes.ENUM,
            values: Object.values(Enum.manageOperationEnum),
        },
        related_type: {
            type: DataTypes.ENUM,
            values: Object.values(Enum.relatedTypeEnum),
        },
        value: { //
            type: DataTypes.TEXT,
        }

    }, {
        tableName: 'j_logs',
        timestamps: true,
        // 不使用 updatedAt
        updatedAt: false,
    });

    const {user: userModel} = sequelize.models
    // 用户
    userModel.hasMany(userMetaModel, {as: 'logs', foreignKey: 'user_id', sourceKey: 'id'})
    return userMetaModel
};
// node ./src/init-db.js
