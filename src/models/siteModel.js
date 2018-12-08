/* jshint indent: 2 */
const Enum = require('../common/enumerate')

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('site', {
        key: {
            type: DataTypes.STRING(30),
            allowNull: false,
            primaryKey: true
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        text: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        textSmall: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        autoLoad: {
            type: DataTypes.ENUM,
            values: Object.values(Enum.SiteEnum),
            allowNull: false
        }

    }, {
        tableName: 'j_site',
        // 不要忘了启用 timestamps
        timestamps: true,

        // 不想使用 createdAt
        createdAt: false
        // paranoid: true
    })
}
