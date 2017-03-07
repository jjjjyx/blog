var fs = require("fs");
var path = require("path")
let dir = "D:/data";
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

fs.readdir("D:/data", function(err, files) {
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
                    let exportPath = path.join('d:',"export",file);
                    if(!fs.existsSync(exportPath)){
                        fs.mkdirSync(exportPath);
                    }
                    let sql = `mysqldump -u root  ${file} ${name} --no-create-info --skip-extended-insert --skip-create-options --compact > ${path.join(exportPath,name+".sql")}`;
                    console.log(sql)
                    ex(sql);
                }
            }
        }
    });
});
