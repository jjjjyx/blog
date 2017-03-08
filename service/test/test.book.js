let url = "/emall/bookShowProductList.do?ci=262673&pg=09&n=2&cp=473&st=0&cc=010";
// url="http://qson.iteye.com/blog/2055523";
var http = require("http");
let options = {
        host: 'list.suning.com', // 这个不用说了, 请求地址
        port:80,
        path:url, // 具体路径, 必须以'/'开头, 是相对于host而言的
        method: 'GET', // 请求方式, 这里以post为例
        headers: { // 必选信息, 如果不知道哪些信息是必须的, 建议用抓包工具看一下, 都写上也无妨...
            'Content-Type': 'text/html; charset=utf-8',
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36",
            // "Upgrade-Insecure-Requests": 1
        }
    };
http.get(options, function (res) {
    var data = "";
    res.on("data",function(chunk){
        data += chunk;
    });
    res.on("end",function(){
        console.log(data,222)
    })
}).on("error", function (err) {
    console.log(err)
})
