'use strict'

import './assets/common.scss'
import './assets/tags.scss'
// import Icon from './components/icon'
import { addClass, removeClass } from './utils/dom'
/* eslint-disable no-unused-vars,no-undef  */
// Vue.use(Icon)
// Vue.config.productionTip = false

function appInit () {
    /* eslint-disable no-new */
    let app = new Vue({
        el: '#app',
        methods: {
            msg () {
                this.$Message.info('该标签下没有文章，不建议查阅~')
            }
        }
    })
    window.fulfilLoading && window.fulfilLoading()
    let tags = document.querySelectorAll('.tags__item')

    let tagHover = (index) => {
        let tag = tags[index]
        removeClass(tag, 'active')
        index++
        if (index >= tags.length) index = 0
        tag = tags[index]
        addClass(tag, 'active')
        setTimeout(tagHover, 1000, index)
    }
    tagHover(0)
}

appInit()
