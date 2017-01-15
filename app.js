let debug = require('debug')('app:' + process.pid);
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let app = express();
// var cors = require('cors');
debug("Starting application");
let expressJwt = require('express-jwt');

// app.set('views', path.join(__dirname, 'client/dist'));
// app.engine("html", require("ejs").__express); // or   app.engine("html",require("ejs").renderFile);
// app.set('view engine', 'html');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3879');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("X-Powered-By", ' 3.2.1')
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    next();
});


var secret = 'this is the secret secret secret 12356';

// We are going to protect /api routes with JWT
app.use('/api/', expressJwt({secret: secret}).unless({path:["/api/user/login"]}));

app.use(bodyParser());
app.use(require('compression')());
app.use('/', express.static(path.join(__dirname, 'client/home')));


app.use(function (err, req, res, next) {
    if (err.constructor.name === 'UnauthorizedError') {
        res.status(401).send('Unauthorized');
    }
});
app.use("/api/user", require(path.join(__dirname, "service/router", "user.js"))());
// app.use("/api/user", require(path.join(__dirname, "service/routes", "user.js"))());
//
// app.post('/authenticate', function (req, res) {
//   //TODO validate req.body.username and req.body.password
//   //if is invalid, return 401
//   if (!(req.body.username === '1' && req.body.password === '2')) {
//     res.status(401).send('Wrong user or password');
//     return;
//   }
//
//   var profile = {
//     first_name: 'John',
//     last_name: 'Doe',
//     email: 'john@doe.com',
//     id: 123
//   };
//
//   // We are sending the profile inside the token
//   var token = jwt.sign(profile, secret,{expiresIn:"7d"});
//
//   res.json({ token: token });
// });
//
//
app.get('/api/verify', function (req, res) {

  console.log('user ' + req.user.user_email + ' is calling /api/restricted');
  res.json({
    name: 'foo'
  });

});



global.C = require("./service/config");

// // console.log(app.get('env'))
// app.get('/', function (req, res) {
//     res.render('abc');
// });




/*错误处理器*/
app.use(function (err, req, res, next) {
    console.log(err.message);
    return res.status(500).json({
        code: 500,
        msg: err.message
    });
});
// // /*404*/
// app.use(function (req, res, next) {
//     let err = new Error('Not Found');
//     err.status = 404;
//     res.render('admin-404');
//     // next(err);
// })





let server = app.listen(C.APP_PORT, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
