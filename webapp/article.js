'use strict'

// import './assets/home.scss'
// import 'animate.css'
import './assets/common.scss'
import './assets/article.scss'
import './assets/comment.scss'
import Icon from './components/icon'
import BlogComment from './components/comment/comment.vue'
import PhotoSwipe from './components/photo-swipe'

import {on, once, addClass, removeClass} from './utils/dom'
import * as articleApi from '@/api/article'
/* eslint-disable no-unused-vars,no-undef  */
Vue.use(Icon)
Vue.use(PhotoSwipe)
Vue.config.productionTip = false

const animationName = window.getAnimation() || 'animationend'
const party = ['富强', '民主', '文明', '和谐', '自由', '平等', '公正', '法治， 爱国', '敬业', '诚信', '友善']

function getPartyCore () {
    return party[Math.ceil(Math.random() * 100000000) % party.length]
}

/**
 * 获取可视高度
 * @returns {number}
 */
function getClientHeight () {
    let clientHeight = 0
    if (document.body.clientHeight && document.documentElement.clientHeight) {
        let clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
    } else {
        let clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight
    }
    return clientHeight
}





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
        computed: {
            // inputStyle () {
            //     return {
            //
            //         top: this.y + 'px',
            //         left: this.x + 'px'
            //     }
            // }
        },
        methods: {
            async heart (event, guid, n) {

                try {
                    await articleApi.heart(guid)
                    // 爱心图标添加动画
                    let heartIcon = this.$refs.heartIcon.$el
                    let heartLabel = this.$refs.heartLabel
                    let heartNum = this.$refs.heartNum
                    once(heartIcon, animationName, () => {
                        removeClass(heartIcon, 'niceIn')
                    })
                    // 创建 +1 元素 飘出
                    this.heartClickEffect('+1', event)
                    heartLabel.innerHTML = '已&nbsp;&nbsp;赞'
                    heartNum.innerHTML = n + 1
                } catch (e) {
                    // 创建 +1 元素 飘出
                    this.heartClickEffect(getPartyCore(), event)
                }
            },
            heartClickEffect (txt, {pageY, pageX}) {
                let $el = document.createElement('span')
                $el.innerText = txt
                $el.className = 'increase-dom increase-out'
                $el.style.cssText = `left:${pageX}px;top:${pageY}px;z-index:9999;`
                document.body.appendChild($el)
                once($el, animationName, () => {
                    document.body.removeChild($el)
                })
            },
            copy (e) {
                let target = e.target
                let content = target.nextSibling.innerText
                this._setCopyElPosition(e)
                this._copy(content)
                // target.s
            },
            _setCopyElPosition (e) {
                let {clientX, clientY} = e
                this.$refs.copyrelay.style.left = `${clientX}px`
                this.$refs.copyrelay.style.top = `${clientY}px`
            },
            _copy (text) {
                this.$refs.copyrelay.value = text
                this.$refs.copyrelay.focus()
                this.$refs.copyrelay.select()
                try {
                    if (document.execCommand('copy', false, null)) {
                        this.$Message.success('复制成功')
                    } else {
                        this.$Message.success('复制失败')
                    }
                } catch (err) {
                    this.$Message.success('复制失败')
                }
            }
        },
        mounted () {
            let {pathname} = location
            this.guid = _.last(pathname.split('/'))
            let falg = true
            on(window, 'scroll', () => {
                const s = document.body.scrollTop === 0 ? document.documentElement.scrollTop : document.body.scrollTop
                if (falg && s > 200) {
                    falg = false
                    articleApi.read(this.guid)
                }
            })
            let galleryElements = document.querySelectorAll('.markdown-body img.j-image-photo-swipe')

            let imageData = Array.prototype.slice.call(galleryElements).map((image) => {
                // console.log(image.width, image.height, image.src)
                return {w: image.width, h: image.height, src: image.src}
            })

            for (let i = 0, l = galleryElements.length; i < l; i++) {
                // galleryElements[i].setAttribute('data-pswp-uid', i + 1)
                galleryElements[i].onclick = (e) => {
                    // console.log(imageData)
                    this.$photoswipe.open(parseInt(i, 10), imageData)
                }
            }
        }
    })



    window.fulfilLoading && window.fulfilLoading()
}

appInit()
