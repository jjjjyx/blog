let db = require("./database");

db.pool.getConnection(function(err,connection){
    let sql = "select * from tb_blog"
    let addBlog = "insert into tb_blog(title,content,time,user_id,annexs,category) values(?,?,?,?,?,?)"
    let val = [
        'hello',
        "### hello world",
        Math.floor(+new Date()/1000),
        0,
        null,
        0
    ]
    connection.query(addBlog,val,(err,result)=>{
        console.log(err)
        console.log(result);
        connection.release();
    })
})
