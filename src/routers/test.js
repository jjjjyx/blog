const utils = require('../utils');

const redisClient = utils.redisClient;

(async function () {

    // let o = await redisClient.hmset('test', "a",2,"b","ddd")
    let o = await redisClient.hincrbyfloat ('test', 'c', 1);
    console.log(o)
})()
