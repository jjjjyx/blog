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

Date.prototype.format = function(format){
    var o = {
            "M+" : this.getMonth()+1, //month
            "d+" : this.getDate(), //day
            "h+" : this.getHours(), //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth()+3)/3), //quarter
            "S" : this.getMilliseconds() //millisecond
        }
        if(/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
}

exports.db = db;
exports.APP_PORT = 3878;
exports.secret = "$2a$10$5A/Wb/EnCwdS2Yxdk0ouGe4beJn7ZTpPD9ofzMdaLc45EgIZwURg6"
exports.allowOrigin = allowOrigin;
