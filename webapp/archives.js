'use strict'
// 与标签公共样式文件
import './assets/common.scss'
import './assets/tags.scss'
import Icon from './components/icon'
/* eslint-disable no-unused-vars,no-undef  */
Vue.use(Icon)
Vue.config.productionTip = false

function appInit () {
    /* eslint-disable no-new */
    let app = new Vue({
        el: '#app',
        methods: {}
    })
    window.fulfilLoading && window.fulfilLoading()
}

appInit()
