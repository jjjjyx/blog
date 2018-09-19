'use strict'

// import './assets/home.scss'
// import 'animate.css'
import './assets/common.scss'
import './assets/article.scss'
import './assets/comment.scss'
import Icon from './components/icon'
import BlogComment from './components/comment/comment.vue'
/* eslint-disable no-unused-vars,no-undef  */
Vue.use(Icon)
Vue.config.productionTip = false

function appInit () {
    /* eslint-disable no-unused-vars  */
    const app = new Vue({
        delimiters: ['${{', '}}'],
        el: '#app',
        data: {
            value1: 0
        },
        components: {
            BlogComment
        },
        methods: {}
    })
    window.fulfilLoading && window.fulfilLoading()
}

appInit()
