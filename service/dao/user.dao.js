const db = require("./database");

class UserDao extends db.BaseDao{
    constructor() {
        super();
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
