'use strict'

import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'normalize.css'
import 'iview/dist/styles/iview.css'
import './main.scss'

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
