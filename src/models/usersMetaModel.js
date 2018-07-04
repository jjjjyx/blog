/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    const userMetaModel = sequelize.define('j_usermeta', {
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
    console.log(sequelize.models)
    // const {usersModel} = sequelize.models
    // const pk = {foreignKey: 'user_id', targetKey: 'id'}
    // usersModel.hasMany(userMetaModel, pk)
    // userMetaModel.belongsTo(usersModel,pk)
    return userMetaModel
};
// node ./src/init-db.js
