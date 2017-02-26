import Vue from 'vue';

import App from './app.vue';
const app = new Vue(App);

// the default export should be a function
// which will receive the context of the render call
export default function (context){
    return new Promise((resolve, reject) => {
        console.log(App);
        console.log(app.hh,"asdasdasdasdasdas");
        resolve(app);
    });
}
