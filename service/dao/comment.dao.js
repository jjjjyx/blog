const db = require("./database");
const _ = require("lodash");
class CommentDao extends db.BaseDao{
    constructor() {
        super();
        this.keys = ['comment_id',"comment_post_id","comment_author","comment_author_email","comment_author_url","comment_author_ip","comment_date","comment_content",
    "comment_approved",'comment_karma',"comment_agent","comment_type","comment_parent","user_id","comment_author_avatar"];
    }
    async asyncInsert(data){
        //`comment_post_id`, `comment_author`, `comment_author_email`, `comment_author_url`, `comment_author_ip`, `comment_date`, `comment_content`,
        //`comment_approved`, `comment_agent`, `comment_parent`, `user_id`
        // const comment_date =;
        data.comment_date =  new Date();
        // 获取楼层 作为插入
        let sql = "SELECT COUNT(*)+1 AS comment_karma FROM `myblog`.`j_comments` WHERE comment_post_id = :comment_post_id";
        let r = await  this.asyncExec(sql, data);
        data.comment_karma = r[0].comment_karma;
        sql = "INSERT INTO `myblog`.`j_comments` (`comment_post_id`, `comment_author`, `comment_author_email`, `comment_author_url`, `comment_author_ip`, `comment_date`, `comment_content`, `comment_agent`, `comment_parent`, `user_id`, `comment_karma`,`comment_author_avatar`) values("+
        ":comment_post_id, :comment_author, :comment_author_email, :comment_author_url, :comment_author_ip, :comment_date, :comment_content, :comment_agent,:comment_parent, :user_id, :comment_karma,:comment_author_avatar)"
        await this.asyncExec(sql, data);
        sql = "UPDATE `myblog`.`j_posts` SET comment_count = comment_count+1 where guid=:comment_post_id";
        this.asyncExec(sql,data);
        return data;
    }
    // INSERT INTO `myblog`.`j_comments` (`comment_post_id`, `comment_author`, `comment_author_email`, `comment_author_url`, `comment_author_ip`, `comment_date`, `comment_content`, `comment_agent`, `comment_parent`, `user_id`,`comment_karma`)
    // VALUES('59113d2cf28c514eeb90bcb5', '123', '123', '123', '123', '123','123', '123',NULL, 1,(SELECT temp.comment_karma FROM (SELECT COUNT(*)+1 AS comment_karma FROM `myblog`.`j_comments` WHERE comment_post_id = '59113d2cf28c514eeb90bcb5') AS temp))
    asyncGetCommentsByPosts (comment_post_id){
        // and comment_approved = 1 没有批准
        // and comment_approved = 2 删除的
        let sql = "select * from `myblog`.`j_comments` where comment_post_id = :comment_post_id  order by comment_karma desc";
        return this.asyncExec(sql,{comment_post_id})
    }

}
const commentDao = new CommentDao();
module.exports = commentDao;
