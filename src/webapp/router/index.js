'use strict'

import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import Index from '@/components/index.vue'
import postManagement from '@/components/post/post-management'
import postWriter from '@/components/post/post-writer'
import postCategory from '@/components/post/post-category.vue'
// import postTest from '@/components/post/post-test'
import NotFound from '../404'

import store from '../store'
import api from '../utils/api'
// import filter from '@/components/filter.vue'
// import scan from '@/components/scan.vue'
Vue.use(Router)

async function isLogIn () {
    let loginStatus = false
    // 判段用户实例是否存在或者过期
    if (!store.getters.isLogin) {
        try {
            let data = await api.nget('/api/user/auth')
            // console.log(code,userdata);
            store.commit('USER_SET_INFO', data)
            loginStatus = true
        } catch (e) {
            loginStatus = false
        }
    } else {
        loginStatus = true
    }
    return loginStatus
}

const routes = [
    {
        path: '/',
        name: 'index',
        component: Index
    },
    {
        path: '/post/management',
        name: 'post_management',
        component: postManagement
    },
    {
        path: '/post/writer',
        name: 'post_writer',
        component: postWriter
    },
    {
        path: '/post/category',
        name: 'post_category',
        component: postCategory
    },
    // {
    //     path: '/post/test',
    //     name: 'post_test',
    //     component: postTest
    // },
    {path: '*', component: NotFound, name: '*'}
]

const router = new Router({
    // mode: 'history',
    mode: 'hash',
    routes: routes
})
router.beforeEach(async function (to, from, next) {
    iView.LoadingBar.start()
    let auth = await isLogIn()
    if (!auth) {
        iView.LoadingBar.error()
        alert('尚未登录!')
        window.location.href = '/'
        return
    }
    next()
})

router.afterEach(function (route) {
    iView.LoadingBar.finish()
})

export default router
