'use strict'

import 'normalize.css'
import 'iview/dist/styles/iview.css'
import './assets/tags.scss'
import 'animate.css'
import Icon from './components/icon'
import {addClass, removeClass} from './utils/dom'
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
    let tags = document.querySelectorAll('.tags__item')

    let tagHover = (index) => {
        let tag = tags[index]
        removeClass(tag, 'active')
        index++
        if (index >= tags.length) index = 0
        tag = tags[index]
        addClass(tag, 'active')
        setTimeout(tagHover, 1000, index)
        // let next = $(".tag.active").removeClass('active').next('.tag');
        // if(!next.length){
        //     next = $(".tag:eq(0)")
        // }
        // next.addClass("active");
    }
    tagHover(0)
    // setInterval(tagHover,1000);
}

appInit()
