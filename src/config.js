'use strict';
// module.exports

let db = {
    host: '127.0.0.1',
    dialect:'mysql',
    user: '',
    password: '',
    database: '',
    connectionLimit: 10,
    supportBigNumbers: true
};
let allowOrigin = "http://localhost:3879";
try {

    let pri = require("../private.js");

    db = pri.db || db;
    allowOrigin = pri.allowOrigin;
} catch (e) {}



exports.APP_PORT = 3878;
exports.db = db;
exports.maxAge = 365*5*60000*60*24;
exports.secret = "$2a$10$5A/Wb/EnCwdS2Yxdk0ouGe4beJn7ZTpPD9ofzMdaLc45EgIZwURg6"
exports.allowOrigin = allowOrigin;
exports.qiUpload= {
    'ACCESS_KEY': 'yON2TZBHksg2FxJdZzrZcm5hDLzEB-YG7I1iyw6I',
    'SECRET_KEY': 'lAkKzNLxsNs9eQXJ6DTyjJAxf6A0A_wsTGYxZDGH',
    'Bucket_Name': 'jyximg',
    'Domain': 'http://oht47c0d0.bkt.clouddn.com/',
    UP_HOST : 'http://upload.qiniu.com',
    UC_HOST :'http://uc.qbox.me',
    RS_HOST : 'http://rs.qbox.me',
    RSF_HOST : 'http://rsf.qbox.me'
};
