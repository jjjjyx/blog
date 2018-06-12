'use strict'

import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import Index from '@/components/index.vue'
// import filter from '@/components/filter.vue'
// import scan from '@/components/scan.vue'

Vue.use(Router)
const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index
    }
]

const router = new Router({
    // mode: 'history',
    mode: 'hash',
    routes: routes
})
router.beforeEach(function (to, from, next) {
    iView.LoadingBar.start()
    next()
})

router.afterEach(function (route) {
    iView.LoadingBar.finish()
})

export default router
