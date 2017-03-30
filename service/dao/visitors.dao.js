const db = require("./database");

class Visitors extends db.BaseDao {
    add({ip,userName='no',address,isp,originalUrl},callback){
        let sql = "INSERT INTO `myblog`.`j_visitors` (`ip`, `create_at`,`userName`,`address`,`isp`,`originalUrl`) VALUES (?, ?, ?, ?, ?, ?);";
        this.execCallBack(sql,[ip,new Date(),userName,address,isp,originalUrl],callback);
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