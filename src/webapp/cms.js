'use strict'

import Vue from 'vue'
import App from './components/cms-app.vue'
import router from './router'
import iView from 'iview'
import 'normalize.css'
import 'iview/dist/styles/iview.css'
import './assets/cms-main.scss'

Vue.use(iView)

Vue.config.productionTip = false

function appInit () {
    /* eslint-disable no-new */
    new Vue({
        el: '#app',
        router,
        components: {App},
        template: '<App/>'
    })
    window.fulfilLoading()
}

appInit()
// // 初始化数据
// function initData(){
//     return new Promise((resolve, reject)=>{
//
//     })
// }
