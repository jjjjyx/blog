/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    const postMetaModel = sequelize.define('j_postmeta', {
        meta_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        post_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'j_posts',
                key: 'id'
            }
        },
        meta_key: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        meta_value: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'j_postmeta',
        timestamps: false,
    });
    const {postsModel} = sequelize.models
    const pk = {foreignKey: 'post_id', targetKey: 'id'}
    postsModel.hasMany(postMetaModel, pk)
    postMetaModel.belongsTo(postsModel,pk)

    return postMetaModel
};
