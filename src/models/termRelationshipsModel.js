/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('j_term_relationships', {
        object_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'j_posts',
                key: 'id'
            }
        },
        term_order: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        term_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'j_terms',
                key: 'term_id'
            }
        }
    }, {
        tableName: 'j_term_relationships',
        timestamps: false,
    });
};
