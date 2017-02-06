'use strict';

let db = require("./database");
// `term_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'term_id：分类ID',
// `name` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '分类名',
// `slug` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '缩略名',
// `term_group` bigint(10) DEFAULT '0' COMMENT '组',

//insert into j_term_taxonomy(term_id,taxonomy,description,count) select term_id,'category' as taxonomy,'分类' as description,0 as count from j_terms


class TermDao {
    loadAll (callback){
        let sql = "select * from j_terms";
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql, (err, result,fields) => {
                connection.release();
                if (err || !result.length) {
                    callback(true);
                    return;
                }else{
                    callback(false, result);
                }
            })
        });
    }
    loadByTaxonomy(taxonomy,callback){
        let sql = "select * from j_terms where taxonomy = ?;";
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql,[taxonomy], (err, result,fields) => {
                connection.release();
                if (err || !result.length) {
                    callback(true);
                    return;
                }else{
                    callback(false, result);
                }
            })
        });
    }
    add ({name,slug,term_group,taxonomy,description},callback){
        let sql = "INSERT INTO `j_terms` (`name`, `slug`, `term_group`,`taxonomy`,`description`,`count`) VALUES (?, ?, ?, ?, ?, 0)";
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }

            connection.query(sql, [name,slug,term_group,taxonomy,description],(err, result) => {
                connection.release();
                console.log(err);
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
    edit ({term_id,name},callback){
        let sql = "UPDATE `j_terms` SET `name`=? WHERE `term_id`= ?";
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql, [name,term_id],(err, result) => {
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
                sql:"DELETE FROM `j_terms` WHERE `term_id`=?",
                params:[term_id]
            },
            // {
            //     sql:"DELETE FROM `j_terms` WHERE `term_id`=?";
            //     params:[term_id]
            // }
        ]
        db.execTrans(sql,callback);
    }
}

class TermsBean {
    constructor(){}
}

const termDao = new TermDao();
module.exports.termDao = termDao;
