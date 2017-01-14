// import "lodash"

import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter);
Vue.config.errorHandler = function (err, vm) {
    console.log(err, vm);
}

import "./static/app.less";

import store from "../store/index.js"

// 入口
import App from "./app.vue";

import Index from "./index.vue";

import NotFoundComponent from "./404.vue"


var router = new VueRouter({
    // mode: "history",
    routes: [{
            path: "/",
            component: Index,
        },
        {
            path: "*",
            component: NotFoundComponent
        }
    ]
})
router.beforeEach(async function (to, from, next) {
    // console.log("浏览: " + to.path);
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
    let context ="default";
    for(let i =0,l=to.matched.length;i<l;i++){
        context = to.matched[i].meta.keyContext ||context;
    }
    // keyboardJS.setContext(context);
    // NProgress.done();
})

const app = new Vue({
    router,
    render: h => h(App)
}).$mount("#main");
window.cookie = $.AMUI.utils.cookie;
