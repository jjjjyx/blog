'use strict'

import './assets/common.scss'
import './assets/home.scss'
import Icon from './components/icon'
import api from './utils/api'
/* eslint-disable no-unused-vars,no-undef  */
Vue.use(Icon)
Vue.config.productionTip = false

// let div = document.createElement('div')
// function appInit () {
/* eslint-disable no-unused-vars  */
const app = new Vue({
    el: '#app',
    delimiters: ['${{', '}}'],
    data: {
        visible: false,
        value1: 0,
        isNext: true,
        loading: false,
        page: 2,
        value13: '' // 搜索
    },
    methods: {
        show: function () {
            this.visible = true
        },
        loadMore: async function () {
            try {
                this.loading = true
                let resp = await api.get('/more', {page: this.page, slug: ''})
                let content = await resp.text()
                if (!content) this.isNext = false
                let el = this.$refs['insertEl']
                el.insertAdjacentHTML('beforebegin', content)
                // div.innerHTML = content
                // let childNodes = Array.prototype.slice.call(div.childNodes)
                // for (let i in childNodes) {
                //     el.parentNode.insertBefore(childNodes[i], el)
                // }
                this.page++
                // console.log(fragment, fragment.firstElementChild)
            } catch (e) {
                console.log('加载失败')
            } finally {
                this.loading = false
            }
        }
    }
})
window.fulfilLoading && window.fulfilLoading()

// }
//
// appInit()
