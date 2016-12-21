var express = require('express');
var path = require('path');
var app = express();

app.set('views', path.join(__dirname, 'client/dist'));
app.engine("html", require("ejs").__express); // or   app.engine("html",require("ejs").renderFile);
app.set('view engine', 'html');
// app.use(function (req, res, next) {
//   var pattern = /.(ttf|otf|eot|woff|jpg|png|jpeg|gif|js|json|html|css|pdf)/
//   if (pattern.test(req.url)) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//   }
//   next();
// });
// 静态文件配置
app.use('/static', express.static(path.join(__dirname, 'client/dist/static')));

global.C = require("./config/config");

// console.log(app.get('env'))
app.get('/', function (req, res) {
    res.render('abc');
});




// /*错误处理器*/
// app.use(function (err, req, res, next) {
//     console.error(err.stack);
//     res.status(500).send("代码出错了,错误信息:<br/>" + err.stack);
// });
// /*404*/
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('admin-404');
    // next(err);
})




var server = app.listen(C.APP_PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
