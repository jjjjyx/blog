'use strict'
let i = 0;
let start = +new Date(),
    duration;

while (i++ < 1000000) {
    const a = 1;
    const b = '1';
    const c = true;
    const d = {};
    const e = [];
}

duration = +new Date() - start;
console.log(duration);

function a(time) {
    return new Promise(function(){
         setTimeout(function () {
            resolve();
        }, time);
    })
}

var start = async function () {
    // 在这里使用起来就像同步代码那样直观
    console.log('start');
    await sleep(3000);
    console.log('end');
};

start();
