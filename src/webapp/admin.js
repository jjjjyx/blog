'use strict'

import Vue from 'vue'
import iView from 'iview'

import api from '@/utils/api'
import App from './admin.vue'
import router from './router'
import i18n from './lang'
import store from './store'
import directives from './directives'
import upload from './components/upload'
import Icon from './components/icon'


import 'normalize.css'
import 'iview/dist/styles/iview.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import './assets/admin.scss'

Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
})
Vue.use(Icon)
Vue.use(upload)
Vue.use(directives)
Vue.config.productionTip = false

function appInit () {
    /* eslint-disable no-new */
    new Vue({
        router,
        store,
        i18n,
        render: h => h(App),
    }).$mount('#app')
    window.fulfilLoading && window.fulfilLoading()
}
// 初始化数据
// 获取基本信息，例如枚举字段的标签

Promise.all([api.nget('/api/user/auth'), api.nget('/api/site/dict')]).then((results) => {
    let [user, dict] = results
    store.commit('USER_SET_INFO', user)
    store.commit('SET_DICT', dict)
    return true
}).then(appInit).catch((e) => {
    // let a = await e
    new Vue().$Modal.error({
        title: '错误',
        content: e,
        onOk: () => {
            window.location.href = '/' // 跳转到首页
        }
    })
})
