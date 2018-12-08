'use strict'

import './assets/common.scss'
import './assets/category.scss'
import Icon from './components/icon'
import api from '@/api'

/* eslint-disable no-unused-vars,no-undef  */
Vue.use(Icon)
// Vue.config.productionTip = false

let div = document.createElement('div')

function appInit () {
    /* eslint-disable no-new */
    new Vue({
        el: '#app',
        data: {
            visible: false,
            value1: 0,
            isNext: true,
            loading: false,
            page: 2,
            slug: '',
            value13: '' // 搜索
        },
        methods: {
            loadMore: async function () {
                try {
                    this.loading = true
                    let resp = await api.get(`./${this.slug}/more`, { page: this.page })
                    let content = await resp.text()
                    if (!content) this.isNext = false
                    let el = this.$refs['insertEl']
                    div.innerHTML = content
                    let childNodes = Array.prototype.slice.call(div.childNodes)
                    for (let i in childNodes) {
                        el.parentNode.insertBefore(childNodes[i], el)
                    }
                    this.page++
                    // console.log(fragment, fragment.firstElementChild)
                } catch (e) {
                    console.log('加载失败', e)
                } finally {
                    this.loading = false
                }
            }
        },
        mounted () {
            this.slug = this.$refs.slug.value
        }
    })
    window.fulfilLoading && window.fulfilLoading()
    // console.log(2222)
}

appInit()
