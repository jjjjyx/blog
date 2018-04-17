const qiniu = require("qiniu"),
    debug = require('debug')('app:routes:upload' + process.pid),
    Router = require("express").Router,
    path = require('path'),
    utils = require('../../utils'),
    _ = require("lodash"),
    request = require('request-json');

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = C.qiUpload.ACCESS_KEY;
qiniu.conf.SECRET_KEY = C.qiUpload.SECRET_KEY;

const domain = C.qiUpload.Domain

const uptoken = new qiniu.rs.PutPolicy(C.qiUpload.Bucket_Name);

// uptoken.ReturnBody = `{ "foo": "bar", "name": $(fname), "size": $(fsize), "type": $(mimeType), "hash":
// $(etag), "w": $(imageInfo.width), "h": $(imageInfo.height), "color":
// $(exif.ColorSpace.val) }`

let client = request.createClient(C.qiUpload.RSF_HOST);
let client2 = request.createClient(C.qiUpload.RS_HOST);
client.headers['Content-Type'] = 'application/x-www-form-urlencoded';
client2.headers['Content-Type'] = 'application/x-www-form-urlencoded';
let list = function(req, res, next){
    let marker = req.query.marker||'';
    let body = `/list?bucket=${C.qiUpload.Bucket_Name}&limit=21&marker=${marker}`;
    let uri = C.qiUpload.RSF_HOST+body;
    client.headers['Authorization'] = utils.generateAccessToken(uri);
    client.get(body,function(err, res2, d){
        res.map = {
            code :0,
            data:d.items,
            domain:C.qiUpload.Domain,
            next: d.marker,
        }
        next();
    })
}
let delImg = function(req, res, next){
    req.checkQuery('key', '').notEmpty();
    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            let map = {
                code: 1,
                msg: result.array()[0].msg
            };
            return res.status(400).json(map);
        }else{
            let key = req.query.key;
            let EncodedEntryURI = utils.urlsafeBase64Encode(`${C.qiUpload.Bucket_Name}:${key}`)
            let body = `/delete/${EncodedEntryURI}`;
            let uri = C.qiUpload.RS_HOST+body;
            client2.headers['Authorization'] = utils.generateAccessToken(uri);
            client2.get(body,function(err, res2, d){
                console.log(d);
                if(d.error){
                    res.map = {
                        code :-1,
                        msg:'删除失败',
                    }
                }else
                    res.map = {
                        code :0,
                        msg:'删除成功',
                    }
                next();
            })
        }
    });

}
module.exports = function () {
    let router = new Router();
    router.route("/token").get(async function (req, res, next) {
        req.checkQuery('md5', '未提交文件MD5').notEmpty().isLength(32);

        let result = await req.getValidationResult();
        if(!result.isEmpty()){
            let map = { code: 1, msg: result.array()[0].msg };
            return res.status(400).json(map);
        }else{
            let token = uptoken.token();
            res.header("Cache-Control", "max-age=0, private, must-revalidate");
            res.header("Pragma", "no-cache");
            res.header("Expires", 0);

            let name = req.query.name;
            let ext = req.query.ext;
            let md5 = req.query.md5;

            ext = _.last(ext.split("/")) || path.extname(name)

            if (token) {
                return res.status(200).json({
                    token,
                    key:md5+'.'+(ext||"png"),
                    domain,
                    uptoken:token
                });
            }
        }

    });

    router.route("/list").get(list,function (req, res, next) {
        return res.status(200).json(res.map);
    });
    router.route("/delImg").get(delImg,function (req, res, next) {
        return res.status(200).json(res.map);
    });


    router.unless = require("express-unless");
    return router;
}
