/**
 * 时间格式化
 * @param format
 * @returns
 */
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

export function re_findall (pattern, s) {
    let result = [];
    s.replace(pattern, (_, val) => { result.push(val); })
    return result;
}

export const initFnName = "init"; // 在扩展类中声明此方法 讲在类初始化的时候掉用

function copyProperties(target, source,c) {
    for (let key of Reflect.ownKeys(source)) {
        if(key === initFnName){
            c.registerInit(source[key]);
        }else if (key !== "constructor" && key !== "prototype" && key !== "name" ) {
            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}

// mix 模式
export function mix(...mixins) {
    class Mix {
        constructor(){
            let initQueue = Mix._initFnQueue.slice();
            while (initQueue.length) initQueue.shift().call(this);
        }
        static registerInit(fn){
            this._initFnQueue.push(fn)
        }
        static _initFnQueue = []
    }

    for (let mixin of mixins) {
        copyProperties(Mix, mixin);
        copyProperties(Mix.prototype, mixin.prototype,Mix);
    }

    return Mix;
}

export function getTimeText(timeInMs,pattern) {
    let ms = Math.abs(timeInMs*1000 - new Date()),
        s = ms / 1000,
        m = s / 60,
        h = m / 60;
    if (s < 60) return `${s|0}秒前`;
    if (m < 60) return `${m|0}分钟前`;
    if (h < 24) return `昨天`;
    return dateFormat(timeInMs,pattern);
}
export function dateFormat(timeInMs,pattern){
    return new Date(timeInMs*1000).format(pattern||'yyyy/MM/dd hh:mm')
}

export const browser = (function() {
    let agent = navigator.userAgent.toLowerCase(),
        opera = window.opera,
        browser;
    // 浏览器对象
    browser = {
        /**
         * @property platform
         * @description 获取浏览器所在系统,"Win"->Windows;"Mac"->Mac;"Lux"->Linux
         * @type {String}
         */
        platform: function(navigator) {
            var _p = {
                win32: "Win",
                macintel: "Mac"
            };
            return _p[navigator.platform.toLowerCase()] || "Lux";
        }(navigator),
        /**
         * 猎豹,区分两种不同内核
         */
        lb: function(agent) {
            if (~agent.indexOf("lbbrowser")) {
                return ~agent.indexOf("msie") ? "ie" : "chrome";
            }
            return false;
        }(agent),
        /**
         * 搜狗
         */
        sg: /se[\s\S]+metasr/.test(agent),
        /**
         * 百度
         */
        bd: !!~agent.indexOf("baidubrowser"),
        /**
         * edge浏览器
         */
        edge: !!~agent.indexOf("edge"),
        /**
         * chrome初始化为false
         * @type {Boolean}
         */
        chrome: false,
        /**
         * @property opera
         * @for kity.Browser
         * @description 判断是否为 Opera 浏览器
         * @type {boolean}
         */
        opera: !!opera && opera.version,
        /**
         * @property webkit
         * @for kity.Browser
         * @description 判断是否为 Webkit 内核的浏览器
         * @type {boolean}
         */
        webkit: agent.indexOf(" applewebkit/") > -1,
        /**
         * @property mac
         * @for kity.Browser
         * @description 判断是否为 Mac 下的浏览器
         * @type {boolean}
         */
        mac: agent.indexOf("macintosh") > -1
    };
    /**
     * @property ie
     * @for kity.Browser
     * @description 判断是否为 IE 浏览器
     * @type {boolean}
     */
    browser.ie = !browser.lb && /(msie\s|trident.*rv:)([\w.]+)/.test(agent);
    browser.gecko = navigator.product == "Gecko" && !browser.webkit && !browser.opera && !browser.ie;
    var version = 0;
    // Internet Explorer 6.0+
    if (browser.ie) {
        version = (agent.match(/(msie\s|trident.*rv:)([\w.]+)/)[2] || 0) * 1;
        browser.ie11Compat = document.documentMode == 11;
        browser.ie9Compat = document.documentMode == 9;
    }
    // Gecko.
    if (browser.gecko) {
        var geckoRelease = agent.match(/rv:([\d\.]+)/);
        if (geckoRelease) {
            geckoRelease = geckoRelease[1].split(".");
            version = geckoRelease[0] * 1e4 + (geckoRelease[1] || 0) * 100 + (geckoRelease[2] || 0) * 1;
        }
    }
    // 排除其他chrome内核的浏览器的干扰
    if (/chrome\/(\d+\.\d)/i.test(agent) && !browser.bd && !browser.opera && !browser.lb && !browser.sg && !browser.edge) {
        /**
         * @property chrome
         * @for kity.Browser
         * @description 判断是否为 Chrome 浏览器
         * @type {boolean}
         */
        browser.chrome = +RegExp["$1"];
    }
    if (/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent)) {
        browser.safari = +(RegExp["$1"] || RegExp["$2"]);
    }
    // Opera 9.50+
    if (browser.opera) version = parseFloat(opera.version());
    // WebKit 522+ (Safari 3+)
    if (browser.webkit) version = parseFloat(agent.match(/ applewebkit\/(\d+)/)[1]);
    // 搜狗版本号无从得知
    // 猎豹版本号无从得知
    // 百度
    if (browser.bd) version = parseFloat(agent.match(/bidubrowser\/(\d+)/)[1]);
    // Opera 9.50+
    if (browser.opera) version = parseFloat(agent.match(/opr\/(\d+)/)[1]);
    // edge
    if (browser.edge) version = parseFloat(agent.match(/edge\/(\d+)/)[1]);
    /**
     * @property version
     * @for kity.Browser
     * @description 获取当前浏览器的版本
     * @type {Number}
     */
    browser.version = version;
    return browser;
})();

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
export function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    // 我可以计算文本宽度了。你问我为啥不也返回一下高度？因为 metrics 里就width这一个值
    // 而文本高度据说实际就是字号的大小
    return metrics.width;
}

// 设置文本选中
export function selectText(element) {
    var text = document.getElementById(element);
    if (document.body.createTextRange) {
        var range = document.body.createTextRange();
        //range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

export function axss(value) {
    var div = document.createElement('div');
    div.innerHTML = value;
    $(div).find('script, iframe, link').remove();
    for (var name in div) {
        if (name.indexOf('on') === 0) {
            div.removeAttribute(name);
        }
    }
    return div.innerHTML;
}
