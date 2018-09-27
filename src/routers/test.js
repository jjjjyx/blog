const utils = require('../utils');

const redisClient = utils.redisClient;

(async function () {

    let o = await redisClient.hmsetAsync('test', "a",2 ,"ooooo","ddd")
    // let o = await redisClient.hincrbyfloat('test', 'c', 1);
    // let o = await redisClient.hgetallAsync('test');
    console.log(o)
})()
