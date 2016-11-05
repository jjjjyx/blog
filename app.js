var express = require('express');
var path = require('path');
var app = express();

app.set('views', path.join(__dirname, 'client/view'));
app.engine("html",require("ejs").__express); // or   app.engine("html",require("ejs").renderFile);
app.set('view engine', 'html');

// 静态文件配置
app.use('/client/dist', express.static(path.join(__dirname, 'client/dist')));

global.C=require("./service/config");
// console.log(app.get('env'))
app.get('/', function (req, res) {
  res.render('index');
});




/*错误处理器*/
app.use(function(err,req,res,next){
  console.error(err.stack);
  res.status(500).send("代码出错了,错误信息:<br/>"+err.stack);
});
/*404*/
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('admin-404');
  next(err);
})




var server = app.listen(C.APP_PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
