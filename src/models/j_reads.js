/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('j_reads', {
        ip: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        guid: {
            type: DataTypes.STRING(25),
            allowNull: false
        },
        useragent: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'j_reads'
    });
};
