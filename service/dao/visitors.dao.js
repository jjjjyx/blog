const db = require("./database");

class Visitors extends db.BaseDao {
    add({ip,userName='no',address},callback){
        let sql = "INSERT INTO `myblog`.`j_visitors` (`ip`, `create_at`,`userName`,`address`) VALUES (?, ?, ?, ?);";
        this.execCallBack(sql,[ip,new Date(),userName,address],callback);
    }
    edit(id,time,callback){

    }
    getVisitorsByIP(ip,callback){
        let sql = 'select * from j_visitors where ip = ? order by create_at desc';
        this.execCallBack(sql,[ip],callback);
    }
}

const visitorsDao = new Visitors();
module.exports = visitorsDao;
