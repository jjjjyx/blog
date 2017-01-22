'use strict';

let db = require("./database");
// `term_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'term_id：分类ID',
// `name` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '分类名',
// `slug` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '缩略名',
// `term_group` bigint(10) DEFAULT '0' COMMENT '组',
class TermDao {
    loadAll (callback){
        let sql = "select * from j_terms;";

        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql, (err, result,fields) => {
                if (err || !result.length) {
                    callback(true);
                    return;
                }else{
                    callback(false, result);
                }
            })
        });
    }
    add ({name,slug,term_group},callback){
        let sql = "INSERT INTO `j_terms` (`name`, `slug`, `term_group`) VALUES (?, ?, ?)";
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql, [name,slug,term_group],(err, result) => {
                console.log(result,err.code,err)

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
}

class TermsBean {
    constructor(){}
}

const termDao = new TermDao();
module.exports.termDao = termDao;
