'use strict';


let db = {
    host: '127.0.0.1',
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

exports.db = db;
exports.APP_PORT = 3878;
exports.secret = "$2a$10$5A/Wb/EnCwdS2Yxdk0ouGe4beJn7ZTpPD9ofzMdaLc45EgIZwURg6"
exports.allowOrigin = allowOrigin;
