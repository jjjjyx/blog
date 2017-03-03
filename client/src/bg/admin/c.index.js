import "lodash"

import Vue from "vue"
import Vuex from "vuex"
import VueRouter from "vue-router"

import keyboardJS from "keyboardjs"

Vue.use(VueRouter);
Vue.config.errorHandler = function (err, vm) {
    console.log(err, vm);
}

import "../static/app.less";

import store from "../../store/index.js"

import {userGetInfo} from "../../../public/js/netapi";
import "../../../public/js/vue.api";

// 入口
import App from "./app.vue";

import Index from "./index.vue";

import Toc from "./Toc.vue";

import PostM from "./post/post.vue";
import AddTerm from "./post/add-term.vue";
import AddPost from "./post/add-post.vue";
import PostEdit from "./post/post-edit.vue";
import PostTrash from "./post/trash.vue";

// import Test from "./testUpload.vue";

import NotFoundComponent from "./404.vue"
// console.log(store.getters.user)
async function isLogIn() {
    let is_login = false;
    // 判段用户实例是否存在或者过期
    if (store.getters.user === null || +new Date() - store.getters.user.validateTime > 60 * 60 * 1000) {
        let date = await userGetInfo();
        // console.log(code,userdata);
        if (date.code === 0) {
            store.commit("USER_SET_INFO", date.data);
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
            components:{
                default:Index,
                toc:Toc
            },
            meta:{
                name:'首页',
                description:'也没什么好说的',
                sub:'dashboard'
            }
        },
        {
            path:"/post/management",
            components:{
                default:PostM,
                toc:Toc
            },
            meta:{
                name:'文章管理',
                description:'管理文章发布状态',
                sub:'Article'
            },

        },
        {
            path:"/post/trash/:id(\\d+)?",
            component:PostTrash,
        },
        {
            path:"/post/category",
            component:AddTerm,
            meta:{
                name:'添加文章',
                description:'撰写文章',
                keyContext: "tag"
            },
            children:[
                {
                    path:':term_id(\\d+)?',
                    components:{
                        default:AddPost,
                        rightW:PostEdit
                    },
                },
                {
                    path:':term_id(\\d+)/article/:id(\\d+)?',
                    components:{
                        default:AddPost,
                        rightW:PostEdit
                    },
                },
            ],

        },
        // {
        //     path:"/test",
        //     component:Test
        // },
        {
            path: "*",
            component: NotFoundComponent
        },

    ]
})
router.beforeEach(async function (to, from, next) {
    // console.log("浏览: " + to.path);
    let auth ;
    try{
        auth = await isLogIn();
    }catch (e) {}
    if (!auth) {
        alert("尚未登录!")
        return window.location.href="/";
    }else
        $("#preloader").fadeOut(1000,()=>$("#preloader").remove());
    next();
});

router.afterEach(function (to) {
    // console.log("成功浏览到: " + to.path);
    let context ="default";
    for(let i =0,l=to.matched.length;i<l;i++){
        context = to.matched[i].meta.keyContext ||context;
    }
    keyboardJS.setContext(context);
    // NProgress.done();
})
const app = new Vue({
    router,
    render: h => h(App)
}).$mount("#main");
window.cookie = $.AMUI.utils.cookie;
