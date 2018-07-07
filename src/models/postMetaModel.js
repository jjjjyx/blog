/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    const postMetaModel = sequelize.define('postMeta', {
        meta_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // post_id: {
        //     type: DataTypes.BIGINT,
        //     allowNull: true,
        //     references: {
        //         model: 'j_posts',
        //         key: 'id'
        //     }
        // },
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
    const {post: postModel} = sequelize.models

    // postModel.hasMany(postMetaModel, {foreignKey: 'post_id', sourceKey: 'post_id'})
    postModel.hasMany(postMetaModel, {as: 'metas', foreignKey: 'post_id', sourceKey: 'id'})
    // postMetaModel.belongsTo(postModel, {foreignKey: 'post_id', targetKey: 'post_id'})

    return postMetaModel
};
