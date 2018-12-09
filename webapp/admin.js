'use strict'

import Vue from 'vue'
import iView from 'iview'
import infiniteScroll from 'vue-infinite-scroll'

// import api from '@/api'
import App from './admin.vue'
import router from './router'
import i18n from './lang'
import store from './store'
import directives from './directives'
import upload from './components/upload'
import Icon from './components/icon'
import PhotoSwipe from './components/photo-swipe'
import Media from './components/media'

import 'normalize.css'
import 'iview/dist/styles/iview.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import './assets/admin.scss'

Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
})
Vue.use(infiniteScroll)
Vue.use(Icon)
Vue.use(directives)
Vue.use(PhotoSwipe)
Vue.use(upload)
Vue.use(Media)
Vue.config.productionTip = false

// function appInit () {
/* eslint-disable no-new */
new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')

window.fulfilLoading && window.fulfilLoading()
// }

// 初始化数据
// 获取基本信息，例如枚举字段的标签
store.dispatch('fetchDict')
