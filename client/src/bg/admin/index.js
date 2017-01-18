// import "lodash"

import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter);
Vue.config.errorHandler = function (err, vm) {
    console.log(err, vm);
}

import "../static/app.less";

import store from "../../store/index.js"

import {userGetInfo} from "../../../public/js/netapi";

// 入口
import App from "./app.vue";

import Index from "./index.vue";

import NotFoundComponent from "./404.vue"
// console.log(store.getters.user)
async function isLogIn() {
    let is_login = false;
    // 判段用户实例是否存在或者过期
    if (store.getters.user === null || +new Date() - store.getters.user.validateTime > 60 * 60 * 1000) {
        let [code, userdata] = await userGetInfo();
        if (code === 0) {
            console.log(userdata);
            store.commit("USER_SET_INFO", userdata);
            is_login = true;
        }
    } else {
        is_login = true;
    }
    return is_login;
}

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
    console.log("浏览: " + to.path);
    let auth = await isLogIn();
    if (!auth) {
        alert("尚未登录!")
        return window.location.href="/";
    }else
        $("#preloader").fadeOut(1000,()=>$("#preloader").remove());
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
