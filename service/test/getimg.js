var http = require("http");
var https = require('https');
var fs = require("fs");
var cheerio = require("cheerio");
// var url = "https://dn-coding-net-production-avatar.qbox.me/Fruit-20.png?imageMogr2/thumbnail/128";
var path = require("path")

function download ( url,callback ) {
    http.get( url,function(res){
        var data = "";
        res.on("data",function(chunk){
            data += chunk;
        });
        res.on("end",function(){
            callback(data);
        })
    }).on("error",function(err){
        console.log(err)
    })
}

let outPath = path.join(__dirname,"coding-avatar");
if(!fs.existsSync(outPath)){
    fs.mkdirSync(outPath,0755);
}
for(let i = 1;i<=24;i++){
    // let url = `http://dn-coding-net-production-avatar.qbox.me/Fruit-${i}.png?imageMogr2/thumbnail/128`
    let url = `https://dn-coding-net-production-avatar.qbox.me/Fruit-${i}.png`
    https.get(url,function(res){
        var imgData="";
        res.setEncoding("binary");
        res.on("data",function(chunk){
            imgData += chunk;
        });
        res.on("end",function(){
            fs.writeFile(path.join(__dirname , "coding-avatar",`avatar-${i}.png`),imgData,"binary",function(err,c){
                // console.log(err);
                if(err){
                    console.log(err);
                }
            })
        })

    })
}

// download(url,function( data ) {
//     if(data){
//         var $ = cheerio.load(data);
//         $("img").each(function(i,elem){
//             var imgSrc=$(this).attr("src");
//             http.get(url + imgSrc,function(res){
//                 var imgData="";
//                 res.setEncoding("binary");
//                 res.on("data",function(chunk){
//                     imgData += chunk;
//                 });
//                 res.on("end",function(){
//                     fs.writeFile(path.join(__dirname , imgSrc),imgData,"binary",function(err,c){
//                         // console.log(err);
//                     })
//                 })
//
//             })
//         })
//     }
// })
