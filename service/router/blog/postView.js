let debug = require('debug')('app:routes:blog/index' + process.pid),
    path = require('path'),
    Router = require("express").Router,
    postDao = require("../../dao/post.dao").postDao;

const VueSSR = require('vue-ssr')
const fs = require('fs');
const resolve = file => path.resolve(__dirname, file);
const vueServerRenderer = require('vue-server-renderer');

const serverConfig = require('../../../webpack/webpack.server');

const indexRenderer = new VueSSR({
    projectName: 'p',
    rendererOptions: {
        cache: require('lru-cache')({
            max: 10240,
            maxAge: 1000 * 60 * 15
        })
    },
    webpackServer: serverConfig
})


module.exports = function() {
    let router = new Router();
    router.route("/p/:guid").get(function(req, res) {
        let template = fs.readFileSync(resolve("../../views/p.html"),'utf8');
        indexRenderer.render(req, res, template);
    })
    router.unless = require("express-unless");
    return router;
}
