const siteDao = require("../dao/site.dao");

module.exports = function(app){
    siteDao.get((err, data) => {
        let site = {}
        data.forEach((item)=>{
            site[item.key] = item.value
        })
        global.SITE = site;

        console.log(global.SITE)
        app.locals['hello'] = function(){ return 'hello'; };
        app.locals['title'] = global.SITE.title;
        app.locals['baiduVerification'] = global.SITE.baiduVerification;
        app.locals['googleVerification'] = global.SITE.googleVerification;
        app.locals['statistical'] = global.statistical;
        app.locals['head'] = function(name,{title,keyword,description} = {}){
            return `
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="keywords" content="${keyword?keyword.map((i)=>i.name).join(','):global.SITE.keyword}">
    <meta name="description" content="${description?description:global.SITE.description}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="baidu-site-verification" content="${global.SITE.baiduVerification}" />
    <meta name="google-site-verification" content="${global.SITE.googleVerification}" />
    <title>${title?title+' | ':''}${global.SITE.title}</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" rel="shortcut icon" />
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <link href="/static/preloader.css" rel="stylesheet">
    <link href="${global.SITE.amazeuiCDN}/css/amazeui.min.css" rel="stylesheet">
    <link href="//cdn.bootcss.com/animate.css/3.5.2/animate.min.css" rel="stylesheet">
    <link href="/static/vendor.css" rel="stylesheet" >
    <link href="/static/${name}.css" rel="stylesheet">
    <script src="${global.SITE.CDN}/jquery/3.1.1/jquery.min.js"></script>
    <script src="${global.SITE.amazeuiCDN}/js/amazeui.min.js"></script>
            `
        }
        app.locals['footer'] = function (name){
            return `
            <script src="${global.SITE.CDN}/vue/2.2.1/vue.min.js"></script>
            <script type="text/javascript" src="/static/vendor.js"></script>
            <script type="text/javascript" src="/static/${name}.js"></script>
            `
        }

    });
}
