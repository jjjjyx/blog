'use strict';

let db = require("./database");
let _ = require("lodash");

// CREATE TABLE `j_posts` (
//   `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
//   `post_author` bigint(20) unsigned DEFAULT '0' COMMENT '对应作者ID',
//   `post_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
//   `post_content` longtext COLLATE utf8_bin COMMENT '正文',
//   `post_title` text COLLATE utf8_bin COMMENT '标题',
//   `post_excerpt` text COLLATE utf8_bin COMMENT '摘录',
//   `post_status` varchar(20) COLLATE utf8_bin DEFAULT 'auto-draft' COMMENT '文章状态（publish/auto-draft/inherit/trash/delete等）',
//   `comment_status` varchar(20) COLLATE utf8_bin DEFAULT 'open' COMMENT '评论状态（open/closed）',
//   `ping_status` varchar(20) COLLATE utf8_bin DEFAULT 'open' COMMENT 'PING状态（open/closed）',
//   `post_password` varchar(20) COLLATE utf8_bin DEFAULT NULL COMMENT '文章密码',
//   `post_name` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '文章缩略名',
//   `term_id` bigint(20) unsigned NOT NULL COMMENT '所属分类',
//   `pinged` text COLLATE utf8_bin COMMENT '已经PING过的链接',
//   `post_modified` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
//   `post_content_filtered` text COLLATE utf8_bin COMMENT '未知\n内容 过滤',
//   `post_parent` bigint(20) unsigned DEFAULT '0' COMMENT '父文章，主要用于PAGE',
//   `guid` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '未知',
//   `menu_order` int(11) DEFAULT '0' COMMENT '排序ID',
//   `post_type` varchar(20) COLLATE utf8_bin DEFAULT 'post' COMMENT '文章类型（post/page等）',
//   `post_mime_type` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT 'MIME类型',
//   `comment_count` bigint(20) DEFAULT '0' COMMENT '评论总数',
//   `seq_in_nb` int(11) DEFAULT '0',
//   PRIMARY KEY (`id`),
//   KEY `post_name` (`post_name`),
//   KEY `type_status_date` (`post_type`,`post_status`,`post_date`,`id`),
//   KEY `post_author` (`post_author`),
//   KEY `fk_j_terms_idx` (`term_id`),
//   CONSTRAINT `fk_j_terms` FOREIGN KEY (`term_id`) REFERENCES `j_terms` (`term_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
//   CONSTRAINT `fk_j_users` FOREIGN KEY (`post_author`) REFERENCES `j_users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
// ) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

// ["id",
// "post_author",
// "post_date",
// "post_content",
// "post_title",
// "post_excerpt",
// "post_status",
// "comment_status",
// "ping_status",
// "post_password",
// "post_name",
// "term_id",
// "pinged",
// "post_modified",
// "post_content_filtered",
// "post_parent",
// "guid",
// "menu_order",
// "post_type",
// "post_mime_type",
// "comment_count",
// "seq_in_nb"]
class PostDao {
    constructor() {
        this.key = ["id",
            "post_author",
            "post_date",
            "post_content",
            "post_title",
            "post_excerpt",
            "post_status",
            "comment_status",
            "ping_status",
            "post_password",
            "post_name",
            "term_id",
            "pinged",
            "post_modified",
            "post_content_filtered",
            "post_parent",
            "guid",
            "menu_order",
            "post_type",
            "post_mime_type",
            "comment_count",
            "seq_in_nb"
        ]

    }
    getPostContentById(id, callback) {
        let sql = "select post_content from j_posts where id = ?";
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql, [id], (err, result) => {
                console.log(err);
                if (err) {
                    callback(true);
                } else {
                    callback(false, result);
                }
                connection.release();
            })
        });
    }
    getPosts(callback) {
        let sql = "select id,post_author,post_date,post_title,post_excerpt,post_status,comment_status,ping_status,post_name,post_modified,post_content_filtered,post_parent,menu_order,post_type,post_mime_type,comment_count,term_id,seq_in_nb,'' as post_content from j_posts";
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql, (err, result) => {
                if (err) {
                    callback(true);
                } else {
                    callback(false, result);
                }
                connection.release();
            })
        });
    }
    save({
        post_author,
        term_id,
        post_title,
        post_content,
        post_status,
        post_name,
        seq_in_nb
    }, callback) {
        // console.log(term_id, post_title, post_author, post_status, post_name)
        // let keys = ['post_author', 'post_date', 'post_content', 'post_title', 'term_id','post_name','post_status','seq_in_nb']
        // let temp = [];
        // for(key of keys){
        //     temp.push(`:${}`)
        // }
        let sql = "INSERT INTO `myblog`.`j_posts` (`post_author`, `post_date`, `post_content`, `post_title`, `term_id`,`post_name`,`post_status`,`seq_in_nb`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);"
        let s = "SELECT taxonomy FROM j_terms where term_id=?;"
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(s, [term_id], (err, result) => {
                if (err) {
                    callback(true);
                } else {
                    // console.log(result);
                    if (result.length == 1 && result[0].taxonomy == 'category') {
                        let post_date = new Date();
                        connection.query(sql, [post_author, new Date(), post_content, post_title, term_id, post_name, post_status, seq_in_nb], (err2, result2) => {
                            console.log(err2)
                            if (err2) {
                                callback(true);
                            } else {
                                let r = {
                                    id: result2.insertId,
                                    post_author,
                                    term_id,
                                    post_title,
                                    post_content,
                                    post_status,
                                    post_name,
                                    post_date,
                                    seq_in_nb
                                }
                                callback(false, r);
                            }
                        })
                    }
                }
                connection.release();
            })
        });
    }
    move(id, term_id, callback) {
        let s = "SELECT taxonomy FROM j_terms where term_id= ?;"
        let self = this;
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(s, [term_id], (err, result) => {
                if (err) {
                    callback(true);
                } else {
                    // console.log(result);
                    if (result.length == 1 && result[0].taxonomy == 'category') {
                        // let post_date = new Date();
                        self.update(id, {
                            term_id
                        }, callback);
                    }
                }
                connection.release();
            })
        });
    }
    update(id, data, callback) {
        let keys = _.intersection(this.key, Object.keys(data));
        let ban = ['post_date', 'guid', 'comment_count','id'];
        data.post_modified = new Date();
        let cc = [];
        for(let k of keys){
            if(ban.indexOf(k)==-1 && data[k]){
                cc.push(`${k} = :${k}`);
            }
        }
        let sql = `UPDATE \`j_posts\` SET ${cc.join(',')} WHERE \`id\`= :id`;
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql, data, (err, result) => {
                if (err) {
                    callback(true);
                } else {
                    // console.log(result,222)
                    callback(false, result);
                }
                connection.release();
            })
        });
    }

    del(id, callback) { // 其他的东西也要删除
        let sql = "DELETE FROM `myblog`.`j_posts` WHERE `id`=?;";
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql, [id], (err, result) => {
                if (err) {
                    callback(true);
                } else {
                    callback(false, result);
                }
                connection.release();
            })
        });
    }
}

const postDao = new PostDao();
module.exports.postDao = postDao;
