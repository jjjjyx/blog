'use strict'

import Vue from 'vue'
import App from './components/cms-app.vue'
import Icon from './components/icon'
import router from './router'
import iView from 'iview'
import 'normalize.css'
import 'iview/dist/styles/iview.css'
import './assets/cms-main.scss'
import api from '@/utils/api'
import store from './store'

Vue.use(iView)
Vue.use(Icon)
Vue.config.productionTip = false

function appInit () {
    /* eslint-disable no-new */
    new Vue({
        el: '#app',
        router,
        components: {App},
        template: '<App/>'
    })
    window.fulfilLoading && window.fulfilLoading()
}
// 初始化数据
// 获取基本信息，例如枚举字段的标签

Promise.all([api.nget('/api/user/auth'), api.nget('/api/site/dict')]).then((results) => {
    let [user, dict] = results
    store.commit('USER_SET_INFO', user)
    store.commit('SET_DICT', dict)
    return true
}).then(appInit).catch(async (e) => {
    // let a = await e
    new Vue().$Modal.error({
        title: '错误',
        content: e
    })
})
