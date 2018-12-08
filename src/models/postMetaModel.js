/* jshint indent: 2 */
// function getMetasObj (){
//     console.log(this.getDataValue('metas'))
//     return common.transformMetas(this.metas)
// }
module.exports = function (sequelize, DataTypes) {
    const postMetaModel = sequelize.define('postMeta', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
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
        timestamps: false
    })
    const { post: postModel } = sequelize.models

    // postModel.hasMany(postMetaModel, {foreignKey: 'post_id', sourceKey: 'post_id'})
    postModel.hasMany(postMetaModel, { as: 'metas', foreignKey: 'post_id', sourceKey: 'id' })
    // postMetaModel.belongsTo(postModel, {foreignKey: 'post_id', targetKey: 'post_id'})

    // postModel.prototype.getMetasObj = getMetasObj
    return postMetaModel
}
