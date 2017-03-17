const db = require("./database");
const _ = require("lodash");
class UserDao extends db.BaseDao{
    constructor() {
        super();
        this.key = [ "id", "user_login", "user_pass", "user_nickname", "user_email",
"user_url", "user_registered", "user_status", "display_name" ]
    }
    getUserByLoginName(username, callback) {
        let sql = "select * from j_users where user_login = ?";
        db.pool.getConnection(function (err, connection) {
            if (err) {
                callback(true);
                return;
            }
            connection.query(sql, [username], (err, result) => {
                connection.release();
                if (err || !result.length) {
                    callback(true);
                }else{
                    callback(false, new UserBean(result[0]));
                }
            })
        });
    }
    updata(user, data, callback, ban = ['id','user_login','user_registered']){
        let keys = _.intersection(this.key, Object.keys(data));
        let cc = [];
        let r_data = {};
        data['id'] = user.id;
        for (let k of keys) {
            if (ban.indexOf(k) == -1 && data[k]) {
                cc.push(`${k} = :${k}`);
            }
            r_data[k] = data[k];
        }
        _.merge(user,r_data);
        let sql = `UPDATE \`j_users\` SET ${cc.join(',')} WHERE \`id\`= :id`;
        this.execCallBack(sql,data,callback,(result)=>{
            return user;
        });
    }
}
class UserBean  {
    constructor({
        id,
        user_login,
        user_pass,
        user_nickname,
        user_email,
        user_url,
        user_registered,
        user_status,
        display_name
    }) {
        this.id = id;
        this.user_pass = user_pass;
        this.user_login = user_login;
        this.user_nickname = user_nickname;
        this.user_email = user_email;
        this.user_url = user_url;
        this.user_registered = user_registered;
        this.user_status = user_status;
        this.display_name = display_name;
    }
}
const userDao = new UserDao();
module.exports = userDao;
