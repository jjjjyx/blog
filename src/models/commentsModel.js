/* jshint indent: 2 */
const utils = require('../utils')
// ALTER TABLE `blog`.`j_comments` CHANGE `comment_post_id` `comment_id` VARCHAR(25) CHARSET utf8 COLLATE utf8_bin NULL;
// ALTER TABLE `blog`.`j_comments` CHANGE `comment_author` `comment_author` VARCHAR(50) CHARSET utf8 COLLATE utf8_bin NULL;
// ALTER TABLE `blog`.`j_comments` DROP FOREIGN KEY `j_comments_ibfk_2`;
// ALTER TABLE `blog`.`j_comments` ADD CONSTRAINT `j_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `blog`.`j_users`(`id`) ON UPDATE CASCADE ON DELETE SET NULL;

//
// ALTER TABLE `blog`.`j_comments` DROP FOREIGN KEY `j_comments_ibfk_1`;
// ALTER TABLE `blog`.`j_comments` ADD CONSTRAINT `j_comments_ibfk_1` FOREIGN KEY (`comment_parent`) REFERENCES `blog`.`j_comments`(`id`) ON UPDATE CASCADE ON DELETE SET NULL;
const moment = require('moment')

module.exports = function (sequelize, DataTypes) {
    let commentModel = sequelize.define('comment', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        comment_id: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        comment_author: {
            type: DataTypes.STRING(50),
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
                key: 'id'
            }
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
        // createdAt: {
        //     get() {
        //         return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
        //     }
        // },
        comment_author_avatar: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'j_comments',
        getterMethods : {
            metas () {
                return utils.transformMetasToObject(this.getDataValue('metas'), 'meta_key')
            },
            time () {
                // 这个时区有毒！！！！
                //  时间超过当前时间 10分钟显示精确时间
                let curr = moment().subtract(10, 'minutes');
                // moment("2018-09-27T18:49:48.525") 2018-09-27T10:59:48.525Z
                // console.log(curr, new Date(), moment())
                let t = moment(this.getDataValue('createdAt'))
                if (t.isBefore(curr)) {
                    return t.format('YYYY-M-D hh:mm')
                } else
                    return t.startOf('minute').fromNow();
            }
        },
        setterMethods: {
            metas (value) {
                this.setDataValue('metas', value)
            }
        }
    })

    const {user: userModel} = sequelize.models

    userModel.hasMany(commentModel, {foreignKey: 'user_id', targetKey: 'id'})
    commentModel.belongsTo(userModel, {foreignKey: 'user_id', targetKey: 'id'})

    commentModel.hasMany(commentModel, {as: 'child', foreignKey: 'comment_parent', sourceKey: 'id'})
    // commentModel.belongsTo(commentModel, {foreignKey: 'comment_parent', targetKey: 'id'})

    return commentModel
};
