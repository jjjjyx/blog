'use strict'

import './assets/common.scss'
import './assets/home.scss'
import Icon from './components/icon'
import api from '@/api'
import infiniteScroll from 'vue-infinite-scroll'
/* eslint-disable no-unused-vars,no-undef  */
Vue.use(infiniteScroll)
Vue.use(Icon)
Vue.config.productionTip = false

const ArticleItems = {
    functional: true
}
const ArticleItemsConstructor = Vue.extend(ArticleItems)
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
        getShowIds () {
            return this.articleEl.map(el => el.getAttribute('data-uid'))
        },
        loadMore: async function () {
            if (!this.isNext) {
                return null
            }
            try {
                this.loading = true
                let ids = this.getShowIds()
                let { result, next } = await api.nget('/more', { ids, slug: '' })
                let el = this.$refs['insertEl']
                result.forEach((content) => {
                    let res = Vue.compile(content)
                    let $article = new ArticleItemsConstructor({
                        render: res.render,
                        staticRenderFns: res.staticRenderFns
                    }).$mount()
                    el.insertAdjacentElement('beforebegin', $article.$el)
                    this.articleEl.push($article.$el)
                    // 图片轮播插件需要更新下宽度，这里手动调用下
                    if ($article.$refs.carousel) {
                        $article.$refs.carousel.handleResize()
                    }
                    // $article.$forceUpdate()?
                })
                this.isNext = next
                // el.
                // el.insertAdjacentHTML('beforebegin', content)
                // if (!content) this.isNext = false

                // div.innerHTML = content
                // let childNodes = Array.prototype.slice.call(div.childNodes)
                // for (let i in childNodes) {
                //     el.parentNode.insertBefore(childNodes[i], el)
                // }
                // this.page++
                // console.log(fragment, fragment.firstElementChild)
            } catch (e) {
                console.log('加载失败', e)
            } finally {
                this.loading = false
            }
        }
    },
    mounted () {
        this.articleEl = Array.prototype.slice.call(document.querySelectorAll('.j-article-item'))
    }
})
window.fulfilLoading && window.fulfilLoading()

// }
//
// appInit()
