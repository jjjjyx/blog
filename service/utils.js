const debug = require('debug')('app:utils:' + process.pid),
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    util = require('util'),
    crypto = require('crypto'),
    redis = require("redis"),
    client = redis.createClient(),
    _ = require("lodash"),
    config = require("./config.js"),
    request = require('request-json'),
    jsonwebtoken = require("jsonwebtoken"),
    xss = require('xss'),
    marked = require("marked"),
    renderer = new marked.Renderer(),
    TOKEN_EXPIRATION = 60, // 单位秒
    TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60*24*5; //
// UnauthorizedAccessError = require(path.join(__dirname, 'errors', 'UnauthorizedAccessError.js'));


client.on('error', function (err) {
    debug(err);
});

client.on('connect', function () {
    debug("Redis successfully connected");
});

exports.isQiniuCallback = isQiniuCallback;

exports.urlsafeBase64Encode = function(jsonFlags) {
  var encoded = new Buffer(jsonFlags).toString('base64');
  return exports.base64ToUrlSafe(encoded);
}

exports.base64ToUrlSafe = function(v) {
  return v.replace(/\//g, '_').replace(/\+/g, '-');
}

exports.hmacSha1 = function(encodedFlags, secretKey) {
  /*
   *return value already encoded with base64
  * */
  var hmac = crypto.createHmac('sha1', secretKey);
  hmac.update(encodedFlags);
  return hmac.digest('base64');
}

// func generateAccessToken

exports.generateAccessToken = function(uri, body) {
  var u = url.parse(uri);
  var path = u.path;
  var access = path + '\n';
  if (body) {
    access += body;
  }
  var digest = exports.hmacSha1(access, C.qiUpload.SECRET_KEY);
  var safeDigest = exports.base64ToUrlSafe(digest);
  return 'QBox ' + C.qiUpload.ACCESS_KEY + ':' + safeDigest;
}

function isQiniuCallback(path, body, callbackAuth) {
  var auth = exports.generateAccessToken(path, body);
  return auth === callbackAuth;
}

module.exports.fetch = function (headers) {
    if (headers && headers.authorization) {
        var authorization = headers.authorization;
        var part = authorization.split(' ');
        if (part.length === 2) {
            return part[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports.create = async function (obj, ban, expiresIn = TOKEN_EXPIRATION_SEC) {
    debug("Create token");
    if (_.isEmpty(obj)) throw new Error('Data cannot be empty.');
    let data = {};
    _.assign(data,obj);
    if(ban instanceof Array){
        for(let k of ban){
            delete data[k];
        }
    }else
        delete data[ban];
    data.token = jsonwebtoken.sign(data,C.secret,{ expiresIn })

    const decoded = jsonwebtoken.decode(data.token);
    data.token_exp = decoded.exp;
    data.token_iat = decoded.iat;

    debug("Token generated for user: %s, token: %s", data.user_login, data.token);
    return new Promise((resolve, reject) => {
        client.set(data.token, JSON.stringify(data), function (err, reply) {
            if (err) {
                return reject(err);
            }else if (reply) {
                client.expire(data.token, expiresIn, (err, reply)=>{
                    if (err) {
                        return reject(new Error("Can not set the expire value for the token key"));
                    } else if (reply) {
                        resolve(data)
                    } else {
                        return reject(new Error('Expiration not set on redis'));
                    }
                });
            } else {
                return reject(new Error('Token not set in redis'));
            }
        });
    });
}

module.exports.retrieve = function (id, done) {

    debug("Calling retrieve for token: %s", id);

    if (_.isNull(id)) {
        return done(new Error("token_invalid"), { "message": "Invalid token" });
    }
    // 先验证toke
    // jsonwebtoken.verify(id,C.secret,(err,p)=>{
    //     console.log(err,p);
    // })

    client.get(id, function (err, reply) {
        if (err) {
            return done(err, { code:200, "message": err });
        }
        if (_.isNull(reply)) {
            return done(new Error("token_invalid"), { code:200, "msg": "Token doesn't exists, are you sure it hasn't expired or been revoked?" });
        } else {
            var data = JSON.parse(reply);
            debug("User data fetched from redis store for user: %s", data.user_login);

            if (_.isEqual(data.token, id)) {
                return done(null, data);
            } else {
                return done(new Error("token_doesnt_exist"), {
                    code:200,
                    "msg": "Token doesn't exists, login into the system so it can generate new token."
                });
            }

        }
    });
};

module.exports.expire = function (req) {

    var token = req.cookies.u;

    debug("Expiring token: %s", token);

    if (token !== null) {
        client.expire(token, 0);
    }

    return token !== null;

};

module.exports.middleware = function () {

    var func = function (req, res, next) {
        var token = req.cookies.u;
        // console.log("u",token);
        exports.retrieve(token, function (err, data) {

            if (err) {
                req.user = undefined;
                // next(new UnauthorizedAccessError("invalid_token", data))
                return res.status(200).json(data);
            } else {
                req.user = _.merge(req.user, data);
                next();
            }

        });
    };

    func.unless = require("express-unless");

    return func;

};

module.exports.getClientIp = function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

module.exports.getIpInfo = function(ip){
    let client = request.createClient('http://ip.taobao.com/');
    return new Promise((resolve, reject) => {
        client.get(`service/getIpInfo.php?ip=${ip}`, function(err, res, body) {
            resolve(body);
        });
    });
}
const x="0123456789qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
module.exports.randomChar = function(l)  {
    var tmp="";
    for(var i=0;i<l;i++)  {
        tmp += x.charAt(Math.ceil(Math.random()*100000000)%x.length);
    }
    return tmp;
}

module.exports.getPostsCounts = function(articleGuidList)  {
    let client = request.createClient('http://api.duoshuo.com');
    return new Promise((resolve, reject) => {
        client.get(`threads/counts.json?short_name=jjjjyx&threads=${articleGuidList.join(',')}`, function(err, res, body) {
            if(err){
                return resolve({});
            }
            resolve(body.response||{});
        });
    });
}

// 为了将markdown 的内容全部提取出来 不包含符号
const textChar = (text) => text || " ";
const emptyChar = () => '';
for (let i in renderer) {
    renderer[i] = textChar
}
renderer.list = emptyChar
renderer.hr = emptyChar
renderer.tablerow = emptyChar
renderer.table = emptyChar;
renderer.code = (code, lang, escaped) => '[code] '
renderer.image = (href, title, text) => '[图片] ';
renderer.link = (href, title, text) => '[link] ';

module.exports.indexLi = function(data){
    let s = "";
    let pH =(guid)=>
        `<form class="password dimmer inverted " method="post" action="/p/${guid}" target="_blank">
        <span class="am-icon-stack">
          <i class="am-icon-circle am-icon-stack-2x"></i>
          <i class="am-icon-expeditedssl am-icon-stack-1x white"></i>
        </span>
        <div class="am-form-group am-margin-top-sm">
            <input type="password" class="am-round" placeholder="输入访问密码" style="width" name="post_password">
            <button class="am-btn am-btn-success am-btn-sm am-round" type="submit">
                <i class="am-icon-arrow-circle-right"></i>
            </button>
        </div>
    </form>
    `;
    let imgH = (guid,post_img)=>`<a class="wrap-img" href="/p/${guid}" target="_blank"><img src="${post_img}?imageView2/1/w/375/h/300" alt="300"></a>`
    let animation =['scale-up','fade','slide-left','slide-bottom'];
    //data-am-scrollspy="{animation: 'fade'}"
    let articleGuidList = data.map((item) => item.guid);

    data.forEach((item) => {
        // <a class="am-corner-label am-orange"></a>
        s += `<article data-node-id='${item.id}' class="${item.ppassword?'blurring  dimmable':''} ${item.post_img?'have-img img-'+item.post_img_position:''}" >
                ${item.ppassword?pH(item.guid):''}
                ${item.post_img?imgH(item.guid,item.post_img):''}
                <div class="content">
                   <h3 class="title"><a href="/p/${item.guid}" target="_blank">${item.menu_order?'<span>[ 置顶 ]</span> ':''}${xss(item.post_title)}</a></h3>
                   <div class="options am-fr">
                       <a class="read" href="/p/${item.guid}" target="_blank">
                           <i class="am-icon-eye"></i> <span class="num">${item.eye_count||0}</span>
                       </a>
                       <a class="comment" href="/p/${item.guid}#comment" target="_blank">
                           <i class="am-icon-comment-o"></i> <span class="num">${item.comment_count}</span>
                       </a>
                       <a class="like">
                           <i class="am-icon-heart-o"></i> <span class="num">${item.likes_count}</span>
                       </a>
                   </div>
                   <div class="meta am-margin-vertical-xs">
                       <a title="${xss(item.post_author)}" class="name" >${xss(item.post_author)}</a> ${new Date(item.post_date).format("yyyy-MM-dd hh:mm:ss")}
                   </div>
                   <p class="">
                        ${xss(marked(item.post_content,{renderer}).substring(0,140))}...
                   </p>
                   <div class="j-category-tag">
                       <a class="category">${item.term_id}</a>
                       ${item.postTag ? `<i class="am-icon-tags"></i> <a>${item.postTag.replace(/,/g,"</a><a>")}</a>`:''}
                   </div>
               </div>
            </article>
        `
    })
    return { data, html:s.split("\n").map((s)=>s.trim()).join('') }
}
