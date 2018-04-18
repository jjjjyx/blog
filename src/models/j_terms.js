/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('j_terms', {
        term_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        slug: {
            type: DataTypes.STRING(200),
            allowNull: true,
            unique: true
        },
        term_group: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: '0'
        },
        taxonomy: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        parent: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        count: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // delete_at: {
        //   type: DataTypes.DATE,
        //   allowNull: true
        // },
        // create_at: {
        //   type: DataTypes.DATE,
        //   allowNull: false,
        //   defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        // },
        icon: {
            type: DataTypes.STRING(200),
            allowNull: true,
            defaultValue: 'am-icon-tag'
        }
    }, {
        tableName: 'j_terms',
        deletedAt: "deleteAt",
        paranoid: true,
    });
};
