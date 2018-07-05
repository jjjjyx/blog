/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    const userMetaModel = sequelize.define('userMeta', {
        meta_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        // user_id: {
        //     type: DataTypes.BIGINT,
        //     allowNull: true,
        //     defaultValue: '0',
        //     references: {
        //         model: 'j_users',
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
        tableName: 'j_usermeta',
        timestamps: false,
    });
    const {user: userModel} = sequelize.models
    const pk = {foreignKey: 'user_id', targetKey: 'id'}
    userModel.hasMany(userMetaModel, pk)
    userMetaModel.belongsTo(userModel,pk)
    return userMetaModel
};
// node ./src/init-db.js
