const db = require("./database");

class Reads extends db.BaseDao {
    add({ip,guid,useragent},callback){
        let sql = [
            {
                sql:"INSERT INTO `myblog`.`j_reads` (`ip`, `create_at`,`guid`,`useragent`) VALUES (?, ?, ?, ?);",
                params: [ip,new Date(),guid,useragent]
            },
            {
                sql:"UPDATE `myblog`.`j_posts` SET `eye_count`=eye_count+1 WHERE `guid`= ?;",
                params: [guid]
            }
        ];

        this.execTrans(sql,callback);
        // this.execCallBack(sql,[ip,new Date(),guid,useragent],callback);
    }
    getReadCountByPostId(guid,callback){
        let sql = 'select count(*) from j_reads where guid = ?';
        this.execCallBack(sql,[guid],callback);
    }
}

const readsDao = new Reads();
module.exports = readsDao;
