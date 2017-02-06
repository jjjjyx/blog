'use strict';

let db = require("./database");

// CREATE TABLE `j_posts` (
//   `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
//   `post_author` bigint(20) unsigned DEFAULT '0' COMMENT '对应作者ID',
//   `post_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
//   `post_content` longtext COLLATE utf8_bin COMMENT '正文',
//   `post_title` text COLLATE utf8_bin COMMENT '标题',
//   `post_excerpt` text COLLATE utf8_bin COMMENT '摘录',
//   `post_status` varchar(20) CHARACTER SET utf8 DEFAULT 'auto-draft' COMMENT '文章状态（publish/auto-draft/inherit/trash/delete等）',
//   `comment_status` varchar(20) COLLATE utf8_bin DEFAULT 'open' COMMENT '评论状态（open/closed）',
//   `ping_status` varchar(20) COLLATE utf8_bin DEFAULT 'open' COMMENT 'PING状态（open/closed）',
//   `post_password` varchar(20) COLLATE utf8_bin DEFAULT NULL COMMENT '文章密码',
//   `post_name` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '文章缩略名',
//   `to_ping` text COLLATE utf8_bin COMMENT '未知',
//   `pinged` text COLLATE utf8_bin COMMENT '已经PING过的链接',
//   `post_modified` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
//   `post_content_filtered` text COLLATE utf8_bin COMMENT '未知\n内容 过滤',
//   `post_parent` bigint(20) unsigned DEFAULT '0' COMMENT '父文章，主要用于PAGE',
//   `guid` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '未知',
//   `menu_order` int(11) DEFAULT '0' COMMENT '排序ID',
//   `post_type` varchar(20) COLLATE utf8_bin DEFAULT 'post' COMMENT '文章类型（post/page等）',
//   `post_mime_type` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT 'MIME类型',
//   `comment_count` bigint(20) DEFAULT '0' COMMENT '评论总数',
//   PRIMARY KEY (`id`),
//   KEY `post_name` (`post_name`),
//   KEY `type_status_date` (`post_type`,`post_status`,`post_date`,`id`),
//   KEY `post_parent` (`post_parent`),
//   KEY `post_author` (`post_author`),
//   CONSTRAINT `fk_ j_posts` FOREIGN KEY (`post_parent`) REFERENCES `j_posts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
//   CONSTRAINT `fk_j_users` FOREIGN KEY (`post_author`) REFERENCES `j_users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

   // id
   // post_author
   // post_date
   // post_content
   // post_title
   // post_excerpt
   // post_status
   // comment_status
   // ping_status
   // post_password
   // post_name
   // to_ping
   // pinged
   // post_modified
   // post_content_filtered
   // post_parent
   // guid
   // menu_order
   // post_type
   // post_mime_type
   // comment_count
   // term_id
class PostDao {
    getPostListByTermId(term_id,callback){

    }
    getPosts(callback){
        let sql = "select id,post_author,post_date,post_title,post_excerpt,post_status,comment_status,ping_status,post_name,post_modified,post_content_filtered,post_parent,menu_order,post_type,post_mime_type,comment_count,term_id from j_posts";
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql,(err, result)=>{
                if (err) {
                    callback(true);
                }else{
                    callback(false, result);
                }
                connection.release();
            })
        });
    }
    save({post_author,term_id,post_title,post_content,post_status,post_name},callback){
        console.log(term_id,post_title,post_author,post_status,post_name)
        let sql ="INSERT INTO `myblog`.`j_posts` (`post_author`, `post_date`, `post_content`, `post_title`, `term_id`,`post_name`,`post_status`) VALUES (?, ?, ?, ?, ?, ?, ?);"
        let s = "SELECT taxonomy FROM j_terms where term_id=?;"
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(s,[term_id],(err, result)=>{
                if (err) {
                    callback(true);
                }else{
                    // console.log(result);
                    if(result.length==1&&result[0].taxonomy=='category'){
                        connection.query(sql, [post_author,new Date(),post_content,post_title,term_id,post_name,post_status],(err2, result2) => {
                            console.log(err2)
                            if (err2) {
                                callback(true);
                            }else{
                                callback(false, result2);
                            }
                        })
                    }
                }
                connection.release();
            })
        });
    }
}

const postDao = new PostDao();
module.exports.postDao = postDao;
