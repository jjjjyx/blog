/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('j_commentmeta', {
        meta_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        comment_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: '0',
            references: {
                model: 'j_comments',
                key: 'comment_id'
            }
        },
        meta_key: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        meta_value: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'j_commentmeta',
        timestamps: false
    });
};
