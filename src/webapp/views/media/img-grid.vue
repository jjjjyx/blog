<template>
    <!--:on-reach-bottom="fetchMedia"-->
    <Scroll @mousedown.native="handleImagesWarpMouseDown"
            class="medium__img" ref="imgs"
            :height="scrollHeight"
            v-context-menu="{menus: contentItems, targetEl: '.img__item'}">
        <img-item :item="item" :index="index"  v-for="(item, index) in data" :key="index"></img-item>
        <!--<div class="medium__img&#45;&#45;not-more" v-if="!isNext">-->
            <!--没有更多了-->
        <!--</div>-->
        <input style="position: absolute;left: -999px;opacity: 0" ref="copyrelay"/>
    </Scroll>
</template>

<script>
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeDefaultUI from 'photoswipe/dist/photoswipe-ui-default'
import {on} from '@/utils/dom'
import ImgItem from './img-item'

const galleryOptions = {
    shareEl: false,
    history: false
}
export default {
    name: 'img-grid',
    data () {
        let moveTarget = []
        let imgSpaces = ['public', 'cover', 'post', 'avatar']
        for (let k of imgSpaces) {
            moveTarget.push({
                label: this.$store.getters.imgSpaces[k],
                callback: (e, target) => {
                    this.$emit('move-img', target, k)
                    // this.moveImg(target, k)
                }
            })
        }
        return {
            scrollHeight: 1500,
            contentItems: [
                {
                    label: '查看',
                    callback: (e, target) => {
                        if (target) {
                            let index = target.getAttribute('data-index')
                            this.openGallery(index)
                        } else {
                            this.$Message.info('请选择图片查看')
                        }
                    }
                },
                {
                    label: '复制链接',
                    callback: (e, target) => {
                        if (target) {
                            let url = target.getAttribute('data-originUrl')
                            this.copy(url)
                        } else {
                            this.$Message.info('请选择图片')
                        }
                    }
                },
                {
                    label: '复制 markdown 链接',
                    callback: (e, target) => {
                        if (target) {
                            let url = target.getAttribute('data-originUrl')
                            this.copy(`![image](${url})`)
                        } else {
                            this.$Message.info('请选择图片')
                        }
                    }
                },
                {
                    label: '移动到其他目录',
                    child: moveTarget
                },
                {
                    divided: true,
                    label: '删除',
                    callback: (e, target) => {
                        this.delImg(target)
                    }
                }
            ],
        }
    },
    components: {
        ImgItem,
    },
    props: {
        data: {
            type: Array,
            required: true
        }
    },
    methods: {
        // 点击容器空白处
        handleImagesWarpMouseDown () {
            this.data.forEach(i => {
                i._checked = false
            })
        },
        openGallery (index) {
            galleryOptions.index = index
            let data = cloneDeep(this.data)
            let gallery = new PhotoSwipe(this.$refs.pswp.$el, PhotoSwipeDefaultUI, data, galleryOptions)
            gallery.init()
        },
        copy (text) {
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
        },
    },
    mounted () {
        let onResize = debounce(() => {
            this.scrollHeight = this.$refs['imgs'].$el.clientHeight
        }, 1000)
        onResize()
        on(window, 'resize', onResize)
    }
}
</script>

