const utils = require('../utils'),
    jsonwebtoken = require("jsonwebtoken"),
    // jwtauth = require("./jwtauth"),
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
    // jwtauth.jwtauth(),
    app.use('/',  require('./blog/index.js')());
    app.use('/p',   require('./blog/postView.js')());
    app.use('/comment',require('./blog/comment.js')());
    app.use('/category',require('./blog/category.js')());
    app.use('/archives', require('./blog/archives.js')());
    app.use('/author', require('./blog/author.js')());
    app.use('/bg/admin',  require('./bg/index.js')());

    app.use("/api/term", require("./bg/term.js")());
    app.use("/api/post", require("./bg/post.js")());
    app.use("/api/user", require("./bg/user.js")());
    app.use('/api/site', require('./bg/site.js')());
    app.use("/api/img" , require("./bg/upLoadFile.js")());
};
