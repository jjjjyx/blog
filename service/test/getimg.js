var http = require("http");
var fs = require("fs");
var cheerio = require("cheerio");
var url = "http://www.jq22.com/demo/jQuery-css320160715/";
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

download(url,function( data ) {
    if(data){
        var $ = cheerio.load(data);
        $("img").each(function(i,elem){
            var imgSrc=$(this).attr("src");
            http.get(url + imgSrc,function(res){
                var imgData="";
                res.setEncoding("binary");
                res.on("data",function(chunk){
                    imgData += chunk;
                });
                res.on("end",function(){
                    fs.writeFile(path.join(__dirname , imgSrc),imgData,"binary",function(err,c){
                        // console.log(err);
                    })
                })

            })
        })
    }
})
