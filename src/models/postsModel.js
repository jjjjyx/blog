       /* jshint indent: 2 */
const {Enum} = require('../common/enum')
const _ = require('lodash')
/*
关于
此表用户记录与维护文章，以及文章的历史版本信息

创建文章            -> 自动草稿
编辑进行保存        -> 草稿
发布
    重新创建一个    -> publish
    原文章          -> inherit // 记录
编辑文章执行保存
    如果不存在自动保存记录
    在次创建一个    -> inherit
编辑文章更新
    修改publish状态的内容
    重新创建一个    -> inherit
 */


function getCategoryOrTags () {
   if (!this.terms) {
       throw new Error('未获取到文章terms 信息')
   }
   let {category = [{name: ''}], post_tag: postTag = []} = _.groupBy(this.terms, 'taxonomy')
   return {
       category: category[0],
       postTag
   }
}

module.exports = function (sequelize, DataTypes) {
    let postModel = sequelize.define('post', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // post_author: {
        //     type: DataTypes.BIGINT,
        //     allowNull: true,
        //     defaultValue: '0',
        //     references: {
        //         model: j_users,
        //         key: 'id'
        //     }
        // },
        post_date: { // 发布时间
            type: DataTypes.DATE,
            allowNull: true
        },
        post_content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        post_title: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        post_excerpt: { // 摘录
            type: DataTypes.TEXT,
            allowNull: true
        },
        post_status: {
            // type: DataTypes.STRING(20),
            // allowNull: false,
            // defaultValue: 'auto-draft'
            type: DataTypes.ENUM,
            values: Object.values(Enum.PostStatusEnum), //['draft', 'auto-draft', 'publish', 'inherit', ..],
            allowNull: false
        },
        comment_status: {
            type: DataTypes.ENUM,
            values: Object.values(Enum.StatusEnum),
            defaultValue: 'open',
            allowNull: false
        },
        ping_status: {
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: 'open'
        },
        post_password: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        post_name: {
            type: DataTypes.STRING(60),
            allowNull: true
        },
        // id: {
        //     type: DataTypes.BIGINT,
        //     allowNull: true,
        //     references: {
        //         model: 'j_terms',
        //         key: 'id'
        //     }
        // },
        pinged: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // post_modified: { 使用 updatedAt
        //     type: DataTypes.DATE,
        //     allowNull: true
        // },
        guid: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        menu_order: { // 在展示文章时的排序
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        post_type: {
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: 'post'
        },
        post_mime_type: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        comment_count: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: '0'
        },
        seq_in_nb: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        // 这几项属性改放在postmeta 中
        // author: {
        //     type: DataTypes.STRING(255),
        //     allowNull: true
        // },
        // eye_count: {
        //     type: DataTypes.BIGINT,
        //     allowNull: true,
        //     defaultValue: '0'
        // },
        // post_img: {
        //     type: DataTypes.STRING(255),
        //     allowNull: true
        // },
        // post_img_position: {
        //     type: DataTypes.STRING(10),
        //     allowNull: true,
        //     defaultValue: 'right'
        // },
        // likes_count: {
        //     type: DataTypes.BIGINT,
        //     allowNull: true,
        //     defaultValue: '0'
        // }
    }, {
        tableName: 'j_posts',
        // 不要忘了启用 timestamps
        timestamps:true,
        deletedAt: "deleteAt",
        paranoid: true
        // indexes:[{
        //     unique: true,
        //     fields: ['post_name','post_title']
        // },]
    });
    const {user: userModel} = sequelize.models
    userModel.hasMany(postModel, {foreignKey: 'post_author', targetKey: 'id'})
    postModel.belongsTo(userModel, {foreignKey: 'post_author', targetKey: 'id'})

    postModel.prototype.getCategoryOrTags = getCategoryOrTags
    return postModel
};
