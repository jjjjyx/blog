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
        this.key = ["id","post_author","post_date","post_content","post_title","post_excerpt","post_status","comment_status","ping_status","post_password","post_name","term_id","pinged","post_modified","post_content_filtered","post_parent","guid","menu_order","post_type","post_mime_type","comment_count","seq_in_nb","delete_at","create_at","author"]
        this.selectSql = `SELECT
            jp.id,
            jp.post_date,
            jp.post_title,
            jp.post_excerpt,
            jp.post_status,
            jp.comment_status,
            jp.ping_status,
            jp.post_name,
            jp.post_modified,
            jp.post_content_filtered,
            jp.post_parent,
            jp.menu_order,
            jp.post_type,
            jp.post_mime_type,
            jp.comment_count,
            jp.term_id,
            jp.guid,
            jp.seq_in_nb,
            '' AS post_content,
            jp.delete_at,
            jp.create_at,
            ju.user_nickname as post_author,
            jp.author,
            case when jp.post_password is null then false else true end as ppassword
        FROM
            j_posts jp left join j_users ju on jp.post_author = ju.id`

    }

    execCallBack(sql,data,callback,resultFormat){
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql,data, (err, result) => {

                if (err) {
                    console.log(err);
                    callback(true);
                } else {
                    if(typeof(resultFormat) == "function"){
                        callback(false, resultFormat(result))
                    }else{
                        callback(false, result)
                    }
                }
                connection.release();
            })
        });
    }

    findPostById(id,callback){
        let sql = `${this.selectSql} WHERE jp.id = ?`;
        this.execCallBack(sql,[id],callback);
    }

    getPostInfoById(id, callback) {
        // let sql = "";
        let sql = [{
            sql: "select post_content from j_posts where id = ?",
            params: [id],
            resultFormat: rows => rows.length ? rows[0] : {}
        }, {
            sql: "select * from myblog.j_terms where term_id in (SELECT term_id FROM myblog.j_term_relationships where object_id=?)",
            params: [id],
        }];
        db.execTrans(sql, callback);
    }
    // 获取发布的文章列表，内容只显示100 字
    getList({hasloadId},f,callback){
        let sql = `
        SELECT
          jp.id,
          jp.post_date,
          jp.post_title,
          jp.post_excerpt,
          jp.post_status,
          jp.comment_status,
          jp.ping_status,
          jp.post_name,
          jp.post_modified,
          jp.post_content_filtered,
          jp.menu_order,
          jp.post_type,
          jp.comment_count,
          jp.eye_count,
          jt.name AS term_id,
          jp.guid,
          LEFT(jp.post_content, 100) AS post_content,
          ju.user_nickname AS post_author,
          jp.author,
          CASE WHEN jp.post_password IS NULL  THEN FALSE  ELSE TRUE  END AS ppassword,
          GROUP_CONCAT(jtr.name) as postTag
        FROM
          j_posts jp
          LEFT JOIN j_users ju  ON jp.post_author = ju.id
          LEFT JOIN j_terms jt  ON jp.term_id = jt.term_id
          LEFT JOIN  (SELECT  j2tr.object_id, j2t.name  FROM j_term_relationships j2tr  LEFT JOIN j_terms j2t  ON j2t.term_id = j2tr.term_id) jtr  ON jtr.object_id = jp.id
        WHERE
            post_status in ('publish') ${hasloadId ? 'and jp.id NOT IN (?) ':''}
        GROUP BY jp.id
        LIMIT 0, 10
        `
        this.execCallBack(sql,[hasloadId],callback,f);
    }

    getPosts(callback) {
        let sql = `${this.selectSql} WHERE post_status not in ('delete')`;
        this.execCallBack(sql,null,callback);
    }

    getTrashPost(callback) {
        let sql = `${this.selectSql} WHERE post_status in ('trash')`;
        this.execCallBack(sql,null,callback);
    }

    save({
        post_author,
        term_id,
        post_title,
        post_content,
        post_status = 'auto-draft',
        post_name,
        seq_in_nb = 0,
        author
    }, callback) {
        let sql = "INSERT INTO `myblog`.`j_posts` (`post_author`, `create_at`, `post_content`, `post_title`, `term_id`,`post_name`,`post_status`,`seq_in_nb`,`author`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"
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
                        let create_at = new Date();
                        connection.query(sql, [post_author, create_at, post_content, post_title, term_id, post_name, post_status, seq_in_nb, author], (err2, result2) => {
                            console.log(err2)
                            if (err2) {
                                callback(true);
                            } else {
                                self.findPostById(result2.insertId,callback);
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
                    if (result.length == 1 && result[0].taxonomy == 'category') {
                        self.update(id, {
                            id,
                            term_id
                        }, callback);
                    }
                }
                connection.release();
            })
        });
    }
    postPublish(id,guid,callback){
        let post_date = new Date();
        let post_status = "publish";
        this.update(id,{id,guid,post_date,post_status},callback,['comment_count', 'id', 'create_at', 'delete_at', 'post_author']);
    }

    postUnPublish(id,callback){
        let post_status = "auto-draft";
        this.update(id,{id,post_status},callback,['comment_count', 'id', 'create_at', 'delete_at', 'post_author']);
    }

    postUnlock(id,callback){
        let sql = "UPDATE `j_posts` SET post_password = null WHERE `id`= :id";
        this.execCallBack(sql,{id},callback);
    }
        // 这里很机智的写法
    update(id, data, callback, ban = ['comment_count', 'id', 'create_at', 'delete_at', 'post_author','post_date', 'post_status', 'guid']) {
        let keys = _.intersection(this.key, Object.keys(data));
        data.post_modified = new Date();
        let cc = [];
        let r_data = {}
        for (let k of keys) {
            if (ban.indexOf(k) == -1 && data[k]) {
                cc.push(`${k} = :${k}`);
            }
            r_data[k] = data[k];
        }
        let sql = `UPDATE \`j_posts\` SET ${cc.join(',')} WHERE \`id\`= :id`;
        // console.log(sql,data,3333)
        this.execCallBack(sql,data,callback,(result)=>{
            return r_data;
        });
    }

    del(id, callback) { // 其他的东西也要删除
        let sql = "UPDATE `myblog`.`j_posts` SET `post_status`='trash', delete_at = ?  WHERE `id`= ?;";
        this.execCallBack(sql,[new Date(), id],callback);
    }

    savePostTag(id, tagList, callback) {
        let sql = [{
                sql: "DELETE FROM `myblog`.`j_term_relationships` WHERE `object_id`=?;",
                params: [id]
            }]
            // for(tag of tagList)
        tagList && tagList.forEach((tag, index) => {
            sql.push({
                sql: "INSERT INTO `myblog`.`j_term_relationships` (`object_id`, `term_order`, `term_id`) VALUES (?,?,?);",
                params: [id, index, tag.term_id]
            })
        })
        db.execTrans(sql, callback);
    }
}

const postDao = new PostDao();
module.exports.postDao = postDao;
