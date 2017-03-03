module.exports = function (app) {
    app.use('/', require('./blog/index.js')());
    app.use('/', require('./blog/postView.js')());
    app.use('/bg/admin', require('./bg/index.js')());
    app.use("/api/term", require("./bg/term.js")());
    app.use("/api/post", require("./bg/post.js")());
    app.use("/api/user", require("./bg/user.js")());
    app.use("/api/img" , require("./bg/upLoadFile.js")());
};
