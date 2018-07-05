/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_login: {
            type: DataTypes.STRING(60),
            allowNull: true,
            unique: true
        },
        user_pass: {
            type: DataTypes.STRING(64),
            allowNull: true
        },
        user_nickname: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        user_email: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        user_url: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        user_status: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        display_name: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        role: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        }
    }, {
        tableName: 'j_users'
    });
};
