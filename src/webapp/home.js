'use strict'

import Vue from 'vue'
import home from './home'
import 'normalize.css'
import './main.scss'


Vue.config.productionTip = false

function appInit () {
    /* eslint-disable no-new */
    new Vue({
        el: '#app',
        components: {home},
        template: '<home/>'
    })
    // window.fulfilLoading()
}

appInit()
