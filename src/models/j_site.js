/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('j_site', {
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
        }
    }, {
        tableName: 'j_site',
        // 不要忘了启用 timestamps
        timestamps: true,

        // 不想使用 createdAt
        createdAt: false,
        // paranoid: true
    });
};
