let debug = require('debug')('app:routes:blog/index' + process.pid),
    path = require('path'),
    Router = require("express").Router,
    xss = require('xss'),
    marked = require("marked"),
    renderer = new marked.Renderer(),
    postDao = require("../../dao/post.dao").postDao;

    const fs = require('fs');
    const vueServerRenderer = require('vue-server-renderer');


console.log(path.resolve('dist/p.js'));
const serverBundleFilePath = path.resolve('dist/p.js')
const serverBundleFileCode = fs.readFileSync(serverBundleFilePath, 'utf8');
const bundleRenderer = vueServerRenderer.createBundleRenderer(serverBundleFileCode);

console.log(serverBundleFileCode);

module.exports = function() {
    let router = new Router();
    router.route("/p/:guid").get(function(req, res) {
        bundleRenderer.renderToString((err, html) => {
            if (err) {
                res.status(500).send(`
                  <h1>Error: ${err.message}</h1>
                  <pre>${err.stack}</pre>
                `);
            } else {
                console.log(html);
                res.render('p', {
                    html
                });
            }
        });
    })

    router.unless = require("express-unless");
    return router;
}
