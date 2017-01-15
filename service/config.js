'use strict';


let db = {
    host: '127.0.0.1',
    user: '',
    password: '',
    database: '',
    connectionLimit: 10,
    supportBigNumbers: true
};
try {

    let pri = require("../private.js");
    console.log("private load")
    db = pri.db || db;

} catch (e) {}

exports.db = db;
exports.APP_PORT = 3878;
exports.secret = "$2a$10$5A/Wb/EnCwdS2Yxdk0ouGe4beJn7ZTpPD9ofzMdaLc45EgIZwURg6"
