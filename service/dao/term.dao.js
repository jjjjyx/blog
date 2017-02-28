'use strict';

let db = require("./database");
// `term_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'term_id：分类ID',
// `name` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '分类名',
// `slug` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '缩略名',
// `term_group` bigint(10) DEFAULT '0' COMMENT '组',

//insert into j_term_taxonomy(term_id,taxonomy,description,count) select term_id,'category' as taxonomy,'分类' as description,0 as count from j_terms


class TermDao {
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

    loadAll (callback){
        let sql = "select * from j_terms";
        this.execCallBack(sql,null,callback);
    }
    loadByTaxonomy(taxonomy,callback){
        let sql = "select * from j_terms where taxonomy = :taxonomy;";
        this.execCallBack(sql,null,callback);
    }

    loadCategory(callback){
        let sql = "select * from j_terms where taxonomy = 'category' and delete_at is null";
        this.execCallBack(sql,null,callback);
    }

    add ({name,slug,term_group,taxonomy,description},callback){
        let sql = "INSERT INTO `j_terms` (`name`, `slug`, `term_group`,`taxonomy`,`description`,`count`) VALUES (:name, :slug, :term_group, :taxonomy, :description, 0)";
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql, {name,slug,term_group,taxonomy,description},(err, result) => {
                connection.release();
                if (err) {
                    if(err.code=='ER_DUP_ENTRY'){
                        return callback(true,"分类已存在")
                    }
                    return callback(true);
                }else{
                    let r = {
                        term_id: result.insertId,
                        name,slug,term_group,taxonomy,description
                    }
                    callback(false, r);
                }
            })
        });
    }
    edit ({term_id,name},callback){
        let sql = "UPDATE `j_terms` SET `name`=:name WHERE `term_id`= :term_id";
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql, {name,term_id},(err, result) => {
                connection.release();
                if (err) {
                    if(err.code=='ER_DUP_ENTRY'){
                        return callback(true,"分类已存在")
                    }
                    return callback(true);
                }else{
                    callback(false, result);
                }
            })
        });
    }
    delete (term_id,callback){
        let sql = [
            {
                // sql:"DELETE FROM `j_posts` WHERE `term_id` = ?",
                sql:"UPDATE `myblog`.`j_posts` SET `post_status`='trash', delete_at = ?  WHERE `term_id`= ?;",
                params:[new Date(),term_id]
            },
            {
                sql:"UPDATE `myblog`.`j_terms` SET `delete_at`= ? WHERE `term_id`=?;",
                params:[new Date(),term_id]
            }

        ]
        db.execTrans(sql,callback);
    }

    deleteTag(term_id,callback){
        let sql = [
            {
                sql:"DELETE FROM `j_term_relationships` WHERE `term_id` = ?",
                params:[term_id]
            },
            {
                sql:"DELETE FROM `j_terms` WHERE `term_id`=?",
                params:[term_id]
            }

        ]
        db.execTrans(sql,callback);
    }
}

class TermsBean {
    constructor(){}
}

const termDao = new TermDao();
module.exports.termDao = termDao;
