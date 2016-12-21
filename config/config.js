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

    db = pri.db || db;
    console.log(pri.db,db)
} catch (e) {}

exports.db = db;
