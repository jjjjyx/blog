'use strict'

import 'normalize.css'
import 'iview/dist/styles/iview.css'
import './assets/home.scss'
import 'animate.css'
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
            value1: 0
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
