'use strict'

import Vue from 'vue'
import App from './cms-app.vue'
import Icon from './components/icon'
import router from './router'
import iView from 'iview'
import 'normalize.css'
import 'iview/dist/styles/iview.css'
import './assets/cms.scss'
import api from '@/utils/api'
import store from './store'
import upload from './components/upload'
import directives from './directives'

Vue.use(iView)
Vue.use(Icon)
Vue.use(upload)
Vue.use(directives)
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
}).then(appInit).catch((e) => {
    // let a = await e
    new Vue().$Modal.error({
        title: '错误',
        content: e,
        onOk: () => {
            window.location.href = '/'
        }
    })
})
