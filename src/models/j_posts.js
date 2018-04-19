/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('j_posts', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        post_author: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: '0',
            references: {
                model: 'j_users',
                key: 'id'
            }
        },
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
        post_excerpt: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        post_status: {
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: 'auto-draft'
        },
        comment_status: {
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: 'open'
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
            type: DataTypes.STRING(200),
            allowNull: true
        },
        term_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'j_terms',
                key: 'term_id'
            }
        },
        pinged: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // post_modified: {
        //     type: DataTypes.DATE,
        //     allowNull: true
        // },
        post_content_filtered: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        post_parent: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: '0'
        },
        guid: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        menu_order: {
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
        paranoid: true,
        // indexes:[{
        //     unique: true,
        //     fields: ['post_name','post_title']
        // },]
    });
};
