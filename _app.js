let debug = require('debug')('app:' + process.pid);
let express = require('express');
let path = require('path');
let ejs = require('ejs');
let bodyParser = require('body-parser');
let app = express();
let cookieParser = require('cookie-parser'),
    expressValidator = require('express-validator');


    const fs = require('fs');
    const vueServerRenderer = require('vue-server-renderer');

process.env.NODE_ENV = process.env.NODE_ENV||'production';
var isDev = process.env.NODE_ENV !== 'production';
debug("Starting application");

let unless = require('express-unless');
let expressJwt = require('express-jwt');
let config = require("./service/config");
let utils = require("./service/utils");
global.C = config;

// app.engine('html', consolidate.ejs);

app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, './service/views'));


// app.use(express.favicon());
app.use(bodyParser());
app.use(expressValidator({
    customValidators:{
        isTermname(value){
            // console.log(value);
            return /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/.test(value)
        },
        isArray: function(value) {
            if(value)
                return Array.isArray(value);
            else return true;
        },
    }
}));
app.use(cookieParser());
app.use(require('compression')());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', C.allowOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Max-Age', 1000);
    res.setHeader('Access-Control-Allow-Headers', '*'); //X-Requested-With,content-type,Authorization,Set-Cookie
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("X-Powered-By", 'test');
    // res.setHeader("Server", 'jjjjyx');
    // res.setHeader("Content-Type", "application/json;charset=utf-8");
    next();
});


app.use(express.static(path.join(__dirname, 'public')));


const serverBundleFilePath = path.join(__dirname, './dist/p.js')
const serverBundleFileCode = fs.readFileSync(serverBundleFilePath, 'utf8');
const bundleRenderer = vueServerRenderer.createBundleRenderer(serverBundleFileCode);

// Client-Side Bundle File
const clientBundleFileUrl = '/p.js';

app.get('/ssr_test', function (req, res) {
    bundleRenderer.renderToString((err, html) => {
      if (err){
        res.status(500).send(`
          <h1>Error: ${err.message}</h1>
          <pre>${err.stack}</pre>
        `);
      } else {
        res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Vue 2.0 SSR</title>
            </head>
            <body>
              ${html}
              <script src="${clientBundleFileUrl}"></script>
            </body>
          </html>`);
      }
    });

});

// /*404*/
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    res.render('404');
})

/*错误处理器*/
app.use(function (err, req, res, next) {
    console.log(err.message);
    if (err.name === 'UnauthorizedError') {
        return res.status(200).send({code:401,msg:'invalid token...'});
    }
    return res.status(500).json({
        code: 500,
        msg: err.message
    });
});
let server = app.listen(C.APP_PORT, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log(`Example app (${isDev?'dev':'production'}) listening at http://${host}:${port}`);
});
