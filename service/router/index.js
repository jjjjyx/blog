const utils = require('../utils'),
    jsonwebtoken = require("jsonwebtoken"),
    visitorsDao = require("../dao/visitors.dao");
module.exports = function (app) {
    app.get("/*",function(req,res,next){
        let originalUrl = req.originalUrl;
        if(!(originalUrl.indexOf("/static")==0||originalUrl.indexOf("/api")==0||originalUrl.indexOf('/favicon.ico')==0)){
            let ip = utils.getClientIp(req);
            let userName ;
            let token = req.cookies.u;
            // console.log(req.cookies.u)
            if(token){
                let decoded = jsonwebtoken.decode(token);
                userName = decoded.user_login;
            }
            // visitorsDao.getVisitorsByIP(ip,(err,data)=>{
            //     let last = data[0];
            //     let jet = true;
            //     if(last){
            //         let last_at = new Date(last.create_at);
            //         jet = ((new Date().getTime() - last_at.getTime())/(1000*60*30))>1;
            //     }
            //     if(jet){
            utils.getIpInfo(ip).then((e)=>{
                let address = "invaild ip.";
                let isp = "";
                if(e.code == 0){
                    address =e.data.country+e.data.region+e.data.city+e.data.county
                    isp = e.data.isp;
                }
                visitorsDao.add({ip,userName,address,isp,originalUrl},()=>{})
            })
            //     }
            // })
        }
        next()
    });
    app.use('/', require('./blog/index.js')());
    app.use('/p', require('./blog/postView.js')());
    app.use('/category', require('./blog/category.js')());
    app.use('/archives', require('./blog/archives.js')());
    app.use('/author',   require('./blog/author.js')());
    app.use('/bg/admin', require('./bg/index.js')());

    app.use("/api/term", require("./bg/term.js")());
    app.use("/api/post", require("./bg/post.js")());
    app.use("/api/user", require("./bg/user.js")());
    app.use('/api/site', require('./bg/site.js')());
    app.use("/api/img" , require("./bg/upLoadFile.js")());
};
