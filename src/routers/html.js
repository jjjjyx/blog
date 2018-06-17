'use strict'


const debug = require('debug')('app:routers:home')
// const ejs = require('ejs');
// const fs = require('fs');
// const path = require("path")

// let DIST_DIR = path.join(__dirname, '../../dist')
let compiler
if (IS_DEV) {
    let webpack = require('webpack'),
        webpackDevConfig = require('../../webpack/webpack.dev.conf')
    compiler = webpack(webpackDevConfig)
    debug("load dev static")
}

// /**
//  * 渲染 数据到页面，
//  * @param name name 页面的名称，data， 数据
//  * @param data
//  */
// module.exports.render = function (name, data) {
//     const filename = path.join(DIST_DIR, name);
//     if (IS_DEV) {
//         compiler.outputFileSystem.readFile(filename,(err, result) =>{
//             if(err){
//                 console.log("err",err)
//                 // return(next(err))
//             }
//             console.log("r = ", result)
//             console.log('h = ', ejs.render(result.toString(), data))
//         })
//     }
//     // let r = ejs.renderFile(name, data);
//     // console.log ("r= ", r)
// }
module.exports.compiler = compiler
