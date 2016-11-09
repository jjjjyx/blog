import "lodash"

import "amazeui/dist/js/amazeui.min.js"
import "amazeui/dist/css/amazeui.min.css"

import Vue from "vue"
import VueResource from "vue-resource"

Vue.use(VueResource);
Vue.config.debug = true;
Vue.http.options.emulateJSON = true;


var App = Vue.extend({
    el(){
        return "#app"
    },
    data(){
        return {
            name:'hello world'
        }
    },
    ready() {
        console.log("asdsa")
    },
    vuex: {

    },
    watch:{

    }
});

var app = new App();
