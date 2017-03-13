
const fs = require("fs");

const os = require('os');
const readline = require('readline');
let fReadName = 'books.bak';
// const fWriteName = './books.sql';
const fRead = fs.createReadStream(fReadName);



const objReadline = readline.createInterface({
    input: fRead,
// 这是另一种复制方式，这样on('line')里就不必再调用fWrite.write(line)，当只是纯粹复制文件时推荐使用
// 但文件末尾会多算一次index计数   sodino.com
//  output: fWrite,
//  terminal: true
});

// INSERT INTO `booksell`.`tb_books` (`author`, `booksName`, `isbn`, `press`, `price`, `publishDate`, `status`, `type`, `context`, `imgUrl`) VALUES ('a', 'a', 'a', 'a', '1', '2017-03-09', '在库', '1', '1', 'a');
let format= ()=>{

}
let sql = "INSERT INTO `booksell`.`tb_books` (`author`, `booksName`, `isbn`, `press`, `price`, `publishDate`, `status`, `type`, `context`, `imgUrl`) VALUES ";
objReadline.on('line', (line) => {
    let row = JSON.parse(line);
    if(row instanceof Array){
        if(row.length){
            console.log(sql);
            row.forEach((item,index)=>{
                let s = `('${item.author.trim().replace(/'|\\/g,"")}','${item['booksName='].trim().replace(/'|\\/g,"")}','${item.isbn.trim()}','${item.press.trim().replace(/'|\\/g,"")}','${item.price}','${item.publishDate.trim()}','在库','${item.type}','${item.context}','${item.imgUrl}')`;
                if(index<row.length-1)
                    console.log(s+",");
                else{
                    console.log(s+";");
                }
            })
        }
    }
});

//  数据库去重
// DELETE FROM tb_books WHERE
// isbn IN (SELECT a.isbn FROM (SELECT  isbn  FROM tb_books  GROUP  BY  isbn  HAVING  COUNT(isbn) > 1) a)  AND
// id NOT IN (SELECT b.id FROM (SELECT MIN(id) AS id FROM  tb_books  GROUP BY isbn  HAVING COUNT(isbn )>1) b)
