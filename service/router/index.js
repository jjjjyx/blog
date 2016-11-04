var express = require('express');

var router=express.Router();
router.get('/',function(req,res,next){
    /*渲染模板*/
    res.render("home/index");
});
module.exports=router;
