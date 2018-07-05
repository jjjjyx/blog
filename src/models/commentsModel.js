/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('comment', {
        comment_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        comment_post_id: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        comment_author: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        comment_author_email: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        comment_author_url: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        comment_author_ip: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        // comment_date: {

        // },
        comment_content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        comment_karma: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '1'
        },
        comment_approved: {
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: '1'
        },
        comment_agent: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        comment_type: {
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: 'normal'
        },
        comment_parent: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: '0',
            references: {
                model: 'j_comments',
                key: 'comment_id'
            }
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: '0',
            references: {
                model: 'j_users',
                key: 'id'
            }
        },
        comment_author_avatar: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'j_comments'
    });
};
