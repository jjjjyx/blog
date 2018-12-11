<template>
    <!--:on-reach-bottom="fetchMedia"-->
    <!--@mousedown.native="handleImagesWarpMouseDown"-->
    <!--<Scroll :on-reach-bottom="handleReachBottom"-->
            <!--class="medium__img" ref="imgs"-->
            <!--:height="scrollHeight">-->
    <div class="medium__img" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="300"
         v-context-menu="{menus: contentItems, targetEl: '.img__item'}">
        <img-item :item="item" :index="index" v-for="(item, index) in data" :key="index"
                  @click.native="handleClickRow(item, index)"></img-item>
    </div>
        <!--<div class="medium__img&#45;&#45;not-more" v-if="!isNext">-->
        <!--没有更多了-->
        <!--</div>-->
    <!--</Scroll>-->
</template>

<script>
import difference from 'lodash/difference'
import cloneDeep from 'lodash/cloneDeep'
import { on, off } from '@/utils/dom'
import { getMetaKeyCode } from '@/utils/common'
import ImgItem from './img-item'
import * as media from '@/api/media'

// todo 媒体文件的多选， 翻译
export default {
    name: 'img-grid',
    data () {
        let moveTarget = []
        let imgSpaces = ['public', 'cover', 'post', 'avatar']
        for (let k of imgSpaces) {
            moveTarget.push({
                label: this.$store.getters.imgSpaces[k],
                callback: (e, target) => {
                    this.moveImg(target, k)
                    // this.$emit('move-img', target, k)
                }
            })
        }
        return {
            scrollHeight: 1500,
            keyDownCode: null,
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
            ]
        }
    },
    components: {
        ImgItem
    },
    props: {
        data: {
            type: Array,
            required: true
        },
        formItem: {
            type: Object,
            required: true
        },
        multiple: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        selectedList: function () {
            return this.data.filter(item => item._checked)
        },
        selectedNum: function () {
            return this.selectedList.length
        },
        busy: function () {
            return this.$parent.isNext
        }
    },
    methods: {
        handleReachBottom () {
            return this.$parent.fetchMedia()
        },
        loadMore () {
            return this.$parent.fetchMedia()
        },
        // 点击容器空白处
        // handleImagesWarpMouseDown (e) {
        handleClickRow (item, index) {
            if (!this.multiple) {
                this.singleToggleSelection(item, index)
            } else if (this.keyDownCode === null) {
                // 清除全部选中
                // this.$refs.view.selectAll(false)
                this.singleToggleSelection(item, index)
            } else if (this.keyDownCode === 4113) { // 按下了 ctrl
                this.toggleCheck(item, index)
            } else if (this.keyDownCode === 16400) { // 按下了 shift
                this.selectInterval(index, this._lastClickIndex)
            } else if (this.keyDownCode === 20497 || this.keyDownCode === 20496) { // 同时按下ctrl + shift
                this.selectInterval(index, this._lastClickIndex, true)
            }
            this.$emit('on-selection-change', cloneDeep(this.selectedList))
            this._lastClickIndex = index
        },
        _selectAll () {
            this.data.forEach((i) => (i._checked = false))
        },
        // 单选
        singleToggleSelection (item) {
            this.data.forEach(i => {
                i._checked = item === i ? !i._checked : false
            })
        },
        toggleCheck (item) {
            item._checked = !item._checked
        },
        selectInterval (index, lastClickIndex, append) {
            if (!append) {
                this._selectAll(false)
            }
            if (lastClickIndex >= 0) {
                if (index < lastClickIndex) {
                    let tmp = index
                    index = lastClickIndex
                    lastClickIndex = tmp
                }

                for (let i = lastClickIndex; i <= index; i++) {
                    // let rowDate = this.data[i]
                    // if (!rowDate._isDisabled) { // 被禁用不可选
                    this.data[i]._checked = true
                    // }
                }
            }
        },
        handleKeyDown: function (e) {
            let keyCode = getMetaKeyCode(e)
            switch (keyCode) {
            case 4113: // 按下了 ctrl
            case 16400: // 按下了 shift
            case 20497: // 同时按下了 shift ctrl
            case 20496: // 同时按下了 ctrl shift
                this.keyDownCode = keyCode
                break
            case 116: // 按下了F5
                // this.fetchData()
                // e.preventDefault()
                break
            default:
                this.keyDownCode = null
            }
        },
        handleKeyUp: function (e) {
            // console.log('keyup', e.keyCode)
            this.keyDownCode = null
            let keyCode = getMetaKeyCode(e)
            switch (keyCode) {
            case 46: // 按下了del
            case 16430: // 按下shift + del
                this.delImg()
                break
            default:
                this.keyDownCode = null
            }
        },
        _getSelectImages (target) {
            let key
            let items = []
            if (this.selectedList.length) {
                items = this.selectedList
            } else if (target) {
                key = target.getAttribute('data-key')
                // if (this.formItem.space !== 'all') {
                let item = this.data.find(item => item.hash === key)
                item && items.push(item)
            }
            return items
        },
        async moveImg (target, space) {
            let items = this._getSelectImages(target)
            let keys = items.map(item => item.hash)
            try {
                await media.move(keys, space)
                if (this.formItem.space !== 'all') {
                    this.data = difference(this.data, items.filter(item => item.space !== space))
                }
                this.$Message.success('完成移动')
            } catch (e) {
                this.$Message.info('移动失败')
            }

            // console.log('space', target , space)
        },
        async delImg (target) {
            let items = this._getSelectImages(target)
            let keys = items.map(item => item.hash)
            try {
                await media.deleteImg(keys)
                // if (this.formItem.space !== 'all') {
                this.data = difference(this.data, items)
                this.$Message.success('删除成功')
            } catch (e) {
                this.$Message.info('删除失败')
            }
        },
        openGallery (index) {
            let data = this.data.map(item => ({
                src: item.url,
                w: item.width,
                h: item.height
            }))

            this.$photoswipe.open(parseInt(index, 10), data)
        },
        copy (text) {
            this.$parent.$refs.copyrelay.value = text
            this.$parent.$refs.copyrelay.focus()
            this.$parent.$refs.copyrelay.select()
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
    created () {
        // todo 全局使用的情况会莫名其妙的触发, 需要判断当前的为弹出模式，决定绑定方式
        on(document.body, 'keydown', this.handleKeyDown)
        on(document.body, 'keyup', this.handleKeyUp)
    },
    destroyed () {
        off(document.body, 'keydown', this.handleKeyDown)
        off(document.body, 'keyup', this.handleKeyUp)
    },
    mounted () {}
}
</script>
