var exec = require('child_process').exec;
exec('dir', function(err,stdout,stderr){
     if(err) {
         console.log('get weather api error:'+stderr);
     } else {
         console.log(stdout);
     }
 });
