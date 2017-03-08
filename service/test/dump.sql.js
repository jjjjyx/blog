var fs = require("fs");
var path = require("path")
let dir = "J:\\无法格式化的文件\\mysql\\333333333333333333\\其他格式";
var exec = require('child_process').exec;

var iconv = require('iconv-lite');
var encoding = 'cp936';
var binaryEncoding = 'binary';

function ex(d){
    exec(d, { encoding: binaryEncoding },function(err,stdout,stderr){
        console.log(err)
        console.log(iconv.decode(new Buffer(stdout, binaryEncoding), encoding), iconv.decode(new Buffer(stderr, binaryEncoding), encoding));
     });
}

function getTableName(p) {
    return new Set(fs.readdirSync(p).map((file)=>{
        return path.basename(file,path.extname(file))
    }))
}


var mkdirs = function(dirpath, mode, callback) {
    fs.exists(dirpath, function(exists) {
        if(exists) {
                callback(dirpath);
        } else {
                mkdirs(path.dirname(dirpath), mode, function(){
                        fs.mkdir(dirpath, mode, callback);
                });
        }
    });
}

fs.readdir(dir, function(err, files) {
    if (err) {
        return console.error(err);
    }
    // console.log(files)
    files.forEach(function(file) {
        if (file != 'mysql') {
            let p = path.join(dir, file)
            let info = fs.statSync(p)
            if (info.isDirectory()) {
                for(let name of getTableName(p)){
                    let exportPath = path.join('d:',"sqlexport","无法格式化的文件/mysql/333333333333333333/其他格式",file);
                    mkdirs(exportPath,null,function(d){
                        let sql = `mysqldump -u root  ${file} ${name} --no-create-info --skip-extended-insert --skip-create-options --compact > ${path.join(exportPath,name+".sql")}`;
                        ex(sql);
                    });

                }
            }
        }
    });
});
