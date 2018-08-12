/* jshint indent: 2 */
const {Enum} = require('../common/enum')

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('resource', {
        hash: {
            type: DataTypes.STRING(30),
            allowNull: false,
            primaryKey: true
        },
        key: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        size: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        uuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        mimeType: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        bucket: {
            type: DataTypes.STRING(80),
            allowNull: false
        },
        url: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        width: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        space: {
            type: DataTypes.ENUM,
            values: Object.values(Enum.ImgEnum),
            defaultValue: 'all',
            allowNull: false
        }
    }, {
        tableName: 'j_resource',
        // 不要忘了启用 timestamps
        timestamps: true,
        paranoid: false,
        updatedAt: false
        // 不想使用 createdAt
        // paranoid: true
    });
};
