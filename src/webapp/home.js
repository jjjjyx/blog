'use strict'

import './assets/home.scss'
import Icon from './components/icon'
/* eslint-disable no-unused-vars,no-undef  */
Vue.use(Icon)
Vue.config.productionTip = false

function appInit () {
    /* eslint-disable no-unused-vars  */
    const app = new Vue({
        el: '#app',
        data: {
            visible: false,
            value1: 0,
            value13: '' // 搜索
        },
        methods: {
            show: function () {
                this.visible = true
            }
        }
    })
    window.fulfilLoading && window.fulfilLoading()
}

appInit()
