const utils = require('../utils'),
    jsonwebtoken = require("jsonwebtoken"),
    visitorsDao = require("../dao/visitors.dao");
const paths = [
    '/',
    '/p',
    '/comment',
    '/category',
    '/archives',
    '/author',
    '/bg/admin'
]

module.exports = function (app) {

    app.use('/',require('./blog/index.js')());
    app.use('/p',           utils.visitorsfilter, require('./blog/postView.js')());
    app.use('/comment',     utils.visitorsfilter, require('./blog/comment.js')());
    app.use('/category',    utils.visitorsfilter, require('./blog/category.js')());
    app.use('/archives',    utils.visitorsfilter, require('./blog/archives.js')());
    app.use('/author',      utils.visitorsfilter, require('./blog/author.js')());
    app.use('/bg/admin',    utils.visitorsfilter, require('./bg/index.js')());

    app.use("/api/term", require("./bg/term.js")());
    app.use("/api/post", require("./bg/post.js")());
    app.use("/api/user", require("./bg/user.js")());
    app.use('/api/site', require('./bg/site.js')());
    app.use("/api/img" , require("./bg/upLoadFile.js")());
};
