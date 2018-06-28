/* jshint indent: 2 */
const {Enum} = require('../common/enum')
/*
分类使用平级

// 一个文章只有一个分类
// 一个文章至多可以有 16 个标签
 */
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
        slug: { // 不能添加唯一约束， 分类的别名与标签可以相同
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        term_group: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: '0'
        },
        taxonomy: {
            type: DataTypes.ENUM,
            values: Object.values(Enum.TaxonomyEnum),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        icon: {
            type: DataTypes.STRING(80),
            allowNull: true,
            defaultValue: ''
        },
        count: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
    }, {
        tableName: 'j_terms',
        deletedAt: "deleteAt",
        paranoid: true,
    });
};
