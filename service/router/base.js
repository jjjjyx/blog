const siteDao = require("../dao/site.dao"),
    moment = require("moment");
let isDev = NODE_ENV !== 'production';
module.exports = function(app){
    siteDao.get((err, data) => {
        let site = {}
        data.forEach((item)=>{
            site[item.key] = item.value
        })
        global.SITE = site;

        // console.log(global.SITE)
        app.locals['hello'] = function(){ return 'hello'; };
        app.locals['title'] = global.SITE.title;
        app.locals['background'] = global.SITE.background;
        app.locals['avatar'] = global.SITE.avatar;
        app.locals['baiduVerification'] = global.SITE.baiduVerification;
        app.locals['googleVerification'] = global.SITE.googleVerification;
        app.locals['statistical'] = global.SITE.statistical;
        app.locals['name'] = global.SITE.name;
        app.locals['sign'] = global.SITE.sign;
        app.locals['dateFormat'] = function(time,f){
            return moment(time).format(f);
        };
        //${!isDev?'<link href="/static/vendor.css" rel="stylesheet" >':''}
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
    <link href="/static/preloader.min.css" rel="stylesheet">
    <link href="${global.SITE.amazeuiCDN}/css/amazeui.min.css" rel="stylesheet">
    <link href="//cdn.bootcss.com/animate.css/3.5.2/animate.min.css" rel="stylesheet">
    <link href="${global.SITE.iconUrl}" rel="stylesheet">
    <link href="/static/${name}.css" rel="stylesheet">
    <script src="${global.SITE.CDN}/jquery/3.1.1/jquery.min.js"></script>
    <script src="${global.SITE.amazeuiCDN}/js/amazeui.min.js"></script>
            `
        }
        app.locals['footer'] = function (name){
            return `
            <script src="${global.SITE.CDN}/vue/2.3.2/vue.min.js"></script>${!isDev?'<script type="text/javascript" src="/static/vendor.js"></script>':''}
            <script type="text/javascript" src="/static/${name}.js"></script>
            <script type="text/javascript">
                if (window.layer) {
                    var fn = function (){
                        var d = new Date();d.setFullYear(d.getFullYear()+10)
                        $.AMUI.utils.cookie.set("closeNotice",true,d,'/')
                    }
                    var isOpen = $.AMUI.utils.cookie.get('closeNotice');
                    !isOpen&&layer.open({
                        type: 1,
                        title: false //不显示标题栏
                            ,
                        closeBtn: false,
                        area: '300px;',
                        shade: 0.8,
                        id: 'JJJjyx' //设定一个id，防止重复弹出
                            ,
                        resize: false,
                        btn: ['火速围观', '残忍拒绝'],
                        btnAlign: 'c',
                        moveType: 1, //拖拽模式，0或者1
                        content: \`
                        <div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">
                            更新啦！！~~<br />
                            * 优化手机界面，更加友好移动端
                            * 加入游客随机评论头像，访问本站随机设置一个水果(coding)头像 有几率抽到康纳~<br />
                            * 加入回复功能<br />
                            * 加入emoji 表情<br />
                            * 修复上下输入框不同步问题等..<br />
                        </div>\`,
                        yes:fn,btn2:fn
                    });
                }
            </script>
            `
        }
        app.locals['part'] = {
            blog:(sticky)=>`
            <div class="part j-blog am-padding-vertical-sm" style="text-align:center;"  ${sticky?'data-am-scrollspynav="{offsetTop: 45}" data-am-sticky="{top:80}"':''}>
                <img src="${site.avatar}" alt="avatar" class="am-circle am-img-thumbnail am-margin-top-sm" height="90" width="90">
                <h3>酱酱酱酱油鲜</h3>
                <p>${site.sign}</p>
                <div class="social-ul">
                    <li>
                        <a href="http://wpa.qq.com/msgrd?v=3&uin=871839012&site=qq&menu=yes" target="_blank"><i class="am-icon-qq"></i></a>
                    </li>
                    <li>
                        <a href="https://github.com/xsq871839012" target="_blank"><i class="am-icon-github"></i></a>
                    </li>
                    <li>
                        <a href="http://weibo.com/5403878645" target="_blank"><i class="am-icon-weibo"></i></a>
                    </li>
                    <li>
                        <a href="javascript:;" data-am-modal="{target: '#weixin-modal'}"><i class="am-icon-weixin"></i></a>
                    </li>
                    <li>
                        <a href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=jyx@rpgame.net" target="_blank"><i class="am-icon-envelope"></i></a>
                    </li>
                </div>
            </div>
            `
        }

    });
}
