const qiniu = require("qiniu"),
    debug = require('debug')('app:routes:upload' + process.pid),
    Router = require("express").Router,
    path = require('path')
    uuid = require("node-uuid");

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = C.qiUpload.ACCESS_KEY;
qiniu.conf.SECRET_KEY = C.qiUpload.SECRET_KEY;

key = 'my-nodejs-logo.png';
let domain = C.qiUpload.Domain


const uptoken = new qiniu.rs.PutPolicy(C.qiUpload.Bucket_Name);

module.exports = function () {
    let router = new Router();
    router.route("/token").get(function (req, res, next) {
        var token = uptoken.token();
        res.header("Cache-Control", "max-age=0, private, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);
        let key = uuid.v1()+'.png';
        if (token) {
            return res.status(200).json({
                token,
                key,
                domain
            });
        }
    });

    router.unless = require("express-unless");
    return router;
}
