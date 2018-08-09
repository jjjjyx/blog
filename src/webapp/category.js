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
    /* eslint-disable no-new */
    // new Vue({
    //     el: '#app',
    //
    // })
    window.fulfilLoading && window.fulfilLoading()
    // console.log(2222)
}

appInit()
