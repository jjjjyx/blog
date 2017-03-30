const utils = require('../utils'),
    termDao = require("../dao/term.dao");

console.log(utils.randomChar(6));

termDao.loadAll((err,data)=>{
    data.forEach((item)=>{
        item.slug = utils.randomChar(6);
        termDao.edit(item,(err,r)=>{
            console.log(r);
        },['term_id','taxonomy','create_at','delete_at'])
    })
})
