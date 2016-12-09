import "lodash"

import "bootstrap/dist/js/bootstrap.min.js"
import "bootstrap/dist/css/bootstrap.min.css"

// CSS
import "./css/index.less";

// animate
import "animate.css/animate.min.css"


import Vue from "vue"
import VueRouter from "vue-router"
import VueResource from "vue-resource"

import store from "./store/index.js"

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.config.errorHandler = function (err, vm) {
    console.log(err, vm);
}

Vue.http.options.emulateJSON = true;


import "./vue.api.js"
import api from "./netapi.js"


// 入口
import App from "./view/app";


import Index from "./view/index.vue";


// test
import Test from "./view/test.vue"
import NotFoundComponent from "./view/404.vue"

var router = new VueRouter({
    // mode: 'history',
    routes: [{
            path: "/",
            component: Index,
        },
        {
            path: "/_test",
            component: Test
        },
        {
            path: "*",
            component: NotFoundComponent
        }
    ]
})
router.beforeEach(async function (to, from, next) {
    console.log("浏览: " + to.path);
    // let auth = await isLogIn();
    // // 页面是否支持未登陆访问
    // if (to.matched.some(record => record.meta.notRequiresAuth)) {
    //     // 如果已登陆
    //     if (auth) {
    //         next("/")
    //     }
    // } else {
    //     if (!auth) {
    //         next({
    //             path: "/user/login",
    //             query: {
    //                 redirect: to.fullPath,
    //                 time: +new Date()
    //             }
    //         })
    //     }
    // }
    next();
});

router.afterEach(function (to) {
    console.log("成功浏览到: " + to.path);
    let context = to.matched[to.matched.length - 1].meta.keyContext;
    //
    // keyboardJS.setContext(context || "default");
    // NProgress.done();
})

const app = new Vue({
    router,
    render: h => h(App)
}).$mount("#main")
