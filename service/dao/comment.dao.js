const db = require("./database");
const _ = require("lodash");
class CommentDao extends db.BaseDao{
    constructor() {
        super();
        this.keys = ['comment_id',"comment_post_id","comment_author","comment_author_email","comment_author_url","comment_author_ip","comment_date","comment_content",
    "comment_approved","comment_agent","comment_type","comment_parent","user_id"];
    }
    asyncInsert(data){
        //`comment_post_id`, `comment_author`, `comment_author_email`, `comment_author_url`, `comment_author_ip`, `comment_date`, `comment_content`,
        `comment_approved`, `comment_agent`, `comment_parent`, `user_id`
        // const comment_date =;
        data.comment_date =  new Date();
        let sql = "INSERT INTO `myblog`.`j_comments` (`comment_post_id`, `comment_author`, `comment_author_email`, `comment_author_url`, `comment_author_ip`, `comment_date`, `comment_content`, `comment_agent`, `comment_parent`, `user_id`) values("+
        ":comment_post_id, :comment_author, :comment_author_email, :comment_author_url, :comment_author_ip, :comment_date, :comment_content, :comment_agent,:comment_parent, :user_id)"

        return this.asyncExec(sql,data)
    }

}
const commentDao = new CommentDao();
module.exports = commentDao;
