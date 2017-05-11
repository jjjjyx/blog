const db = require("./database");
const _ = require("lodash");
class SiteDao extends db.BaseDao{
    constructor() {
        super();
        this.keys = ['key',"value"];
        let sql = "select a.key from j_site a";
        const fn = (err,result)=>{
            if(err) return this.execCallBack(sql,null,fn);
            this.siteKey = result.map((item)=>item.key);
        }
        this.execCallBack(sql,null,fn);
    }
    get(callback){
        let sql = "select * from j_site";
        this.execCallBack(sql,null,callback);
    }
    update(data,callback){
        let keys = _.intersection(this.siteKey, Object.keys(data));
        let sql = [];
        keys.forEach((key)=>{
            if(data[key]&&data[key].trim()){
                sql.push({
                    sql:'UPDATE `myblog`.`j_site` SET `value` = ? WHERE `key` = ?; ',
                    params:[data[key],key]
                })
            }
        })
        this.execTrans(sql,callback);
    }
}
const siteDao = new SiteDao();
module.exports = siteDao;
