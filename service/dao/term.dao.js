const db = require("./database");
const _ = require("lodash");
// `term_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'term_id：分类ID',
// `name` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '分类名',
// `slug` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '缩略名',
// `term_group` bigint(10) DEFAULT '0' COMMENT '组',

//insert into j_term_taxonomy(term_id,taxonomy,description,count) select term_id,'category' as taxonomy,'分类' as description,0 as count from j_terms


class TermDao extends db.BaseDao{
    constructor() {
        super();
        this.keys = [ 'term_id', 'name', 'slug', 'term_group', 'taxonomy', 'parent',
'count', 'description', 'delete_at', 'create_at', 'icon', ]
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
    //{name,slug,term_group,taxonomy,description,icon}
    // 这里逻辑比较复杂 写个注释
    // 首先查询数据库有没有重复的
    // 如果有： 判断是否是删除的
    //      如果是删除的  修改删除的 将其恢复
    //      如果不是 返回错误提示
    // 如果没有 执行添加
    add (data,callback){
        for (let k of this.keys) {
            data[k] = data[k]||'';
        }
        let sql = "INSERT INTO `j_terms` (`name`, `slug`, `term_group`,`taxonomy`,`description`,`count`,`icon`) VALUES (:name, :slug, :term_group, :taxonomy, :description, 0,:icon)";
        let sql2 = "select * from j_terms where taxonomy = ? and name = ?";
        this.execCallBack(sql2,[data.taxonomy,data.name],(err,d)=>{
            if(err){
                callback(true);
            }else{
                let newD;
                let term_id
                if(d.length){ // 已存在
                    if(d[0].delete_at){
                        newD = {};
                        term_id = d[0].term_id;
                        Object.assign(newD,d[0],data)
                        sql = "UPDATE `j_terms` SET delete_at = null,description=:description,count=:count,icon=:icon WHERE `term_id`= :term_id"
                    }else{
                        return callback(true,"分类已经存在")
                    }
                }
                this.execCallBack(sql,newD||data,callback,(result)=>{
                    data.term_id = term_id||result.insertId
                    return data;
                })
            }
        })
    }
    edit (data,callback,ban=['term_id','slug','taxonomy','create_at','delete_at']){
        let keys = _.intersection(this.keys, Object.keys(data));
        let cc = [];
        let r_data = {}
        for (let k of keys) {
            if (ban.indexOf(k) == -1 && data[k]) {
                cc.push(`${k} = :${k}`);
            }
            r_data[k] = data[k];
        }
        let sql = `UPDATE \`j_terms\` SET ${cc.join(',')} WHERE \`term_id\`= :term_id`;
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql, data, (err, result) => {
                connection.release();
                if (err) {
                    if(err.code=='ER_DUP_ENTRY'){
                        return callback(true,"分类已存在")
                    }
                    return callback(true);
                }else{
                    callback(false, r_data);
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
        this.execTrans(sql,callback);
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
        this.execTrans(sql,callback);
    }
}

class TermsBean {
    constructor(){}
}

const termDao = new TermDao();
module.exports = termDao;
