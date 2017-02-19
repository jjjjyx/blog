// import "lodash";

import "./static/css/index.less";

import Vue from "vue"
// import VueResource from "vue-resource"

// Vue.use(VueResource);
Vue.config.errorHandler = function (err, vm) {
    console.log(err, vm);
}

// Vue.http.options.emulateJSON = true;

import "../../public/js/vue.api.js"
import api from "../../public/js/api.js"

import App from "./app";

const app = new Vue({
    el:'#main',
    ...App
})
