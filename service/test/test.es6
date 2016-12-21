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