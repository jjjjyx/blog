/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('visitor', {
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
        // create_at: {
        //     type: DataTypes.DATE,
        //     allowNull: false,
        //     defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        // },
        userName: {
            type: DataTypes.STRING(60),
            allowNull: true,
            defaultValue: 'no'
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        isp: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        originalUrl: {
            type: DataTypes.STRING(300),
            allowNull: true
        }
    }, {
        tableName: 'j_visitors',
        timestamps: true,
        updatedAt: false
    })
}
