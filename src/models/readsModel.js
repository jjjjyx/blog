/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('read', {
        ip: {
            type: DataTypes.STRING(15),
            allowNull: false,
            primaryKey: true,
        },
        guid: {
            type: DataTypes.STRING(25),
            allowNull: false,
            primaryKey: true,
        },
        useragent: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'j_reads',
        timestamps: true,
        // 不想使用 updatedAt
        updatedAt: false,
    });
};
