/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    const commentMetaModel = sequelize.define('commentMeta', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // id: {
        //     type: DataTypes.BIGINT,
        //     allowNull: true,
        //     defaultValue: '0',
        //     references: {
        //         model: 'j_comments',
        //         key: 'id'
        //     }
        // },
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
    // const {j_users} = sequelize.models
    const {comment: commentModel} = sequelize.models
    // const pk = {foreignKey: 'id', targetKey: 'id'}
    commentModel.hasMany(commentMetaModel, {as: 'metas', foreignKey: 'id', sourceKey: 'id'})
    // commentMetaModel.belongsTo(commentModel, pk)
    return commentMetaModel
};
