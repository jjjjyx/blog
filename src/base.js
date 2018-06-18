'use strict'

const moment = require("moment")
const crypto=require('crypto');


function randomHex (){
    let  md5 = crypto.createHash("md5");
    md5.update("" + Date.now());
    return md5.digest('hex');
}

module.exports = function (app) {
    let CND_SRC = function (name) {
        return `${SITE.CDN}/${name}`
    }
    app.locals['site'] = SITE;
    app.locals['dev'] = IS_DEV;
    app.locals['cdn'] = CND_SRC;

    // 创建
    app.locals['dateFormat'] = function(time, f){
        return moment(time).format(f);
    };
    const hash = randomHex();
    // 每次重新启动的时候静态资源都要去除缓存
    app.locals['hash'] = hash;
    app.locals['statistical'] = SITE.statistical;
};
