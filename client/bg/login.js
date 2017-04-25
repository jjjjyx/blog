// import "lodash";
import Vue from "vue";
import "./static/app.less";
import App from "./login.vue";

// import VueResource from "vue-resource"

// Vue.use(VueResource);
Vue.config.errorHandler = function errorHandler(err, vm) {
    console.log(err, vm);
};

// Vue.http.options.emulateJSON = true;

// import "../../public/js/vue.api.js"
// import api from "../../public/js/netapi.js"

const app = new Vue({
    el: "#main",
    render: h => h(App)
});
window.cookie = $.AMUI.utils.cookie;
