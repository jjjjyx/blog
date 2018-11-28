<template>
    <!--:on-reach-bottom="fetchMedia"-->
    <!--@mousedown.native="handleImagesWarpMouseDown"-->
    <Scroll :on-reach-bottom="handleReachBottom"
            class="medium__img" ref="imgs"
            :height="scrollHeight">
        <img-item :item="item" :index="index" v-for="(item, index) in data" :key="index"
                  @click.native="handleClickRow(item, index)"></img-item>
        <!--<div class="medium__img&#45;&#45;not-more" v-if="!isNext">-->
        <!--没有更多了-->
        <!--</div>-->
    </Scroll>
</template>

<script>
    import debounce from 'lodash/debounce'
    import { on, off } from '@/utils/dom'
    import { getMetaKeyCode } from '@/utils/common'
    import ImgItem from './img-item'

    // todo 媒体文件的多选， 翻译
    export default {
        name: 'img-grid',
        data () {

            return {
                scrollHeight: 1500,
                keydownCode: null
            }
        },
        components: {
            ImgItem
        },
        props: {
            data: {
                type: Array,
                required: true
            }
        },
        methods: {
            handleReachBottom () {
                return this.$parent.fetchMedia()
            },
            // 点击容器空白处
            // handleImagesWarpMouseDown (e) {
            handleClickRow (item, index) {
                if (this.keydownCode === null) {
                    // 清除全部选中
                    // this.$refs.view.selectAll(false)
                    this.singleToggleSelection(item, index)
                } else if (this.keydownCode === 4113) { // 按下了 ctrl
                    this.toggleCheck(item, index)
                } else if (this.keydownCode === 16400) { // 按下了 shift
                    this.selectInterval(index, this._lastClickIndex)
                } else if (this.keydownCode === 20497 || this.keydownCode === 20496) { // 同时按下ctrl + shift
                    this.selectInterval(index, this._lastClickIndex, true)
                }
                this._lastClickIndex = index
            },
            _selectAll () {
                this.data.forEach(i => i._checked = false)
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
                        this.keydownCode = keyCode
                        break
                    case 116: // 按下了F5
                        // this.fetchData()
                        // e.preventDefault()
                        break
                    default:
                        this.keydownCode = null
                }
            },
            handleKeyUp: function (e) {
                // console.log('keyup', e.keyCode)
                this.keydownCode = null
                let keyCode = getMetaKeyCode(e)
                switch (keyCode) {
                    case 46: // 按下了del
                        // this.deleteFiles()
                        break
                    case 16430: // 按下shift + del
                        break
                    default:
                        this.keydownCode = null
                }
            }
        },
        created () {
            on(document.body, 'keydown', this.handleKeyDown)
            on(document.body, 'keyup', this.handleKeyUp)
        },
        destroyed () {
            off(document.body, 'keydown', this.handleKeyDown)
            off(document.body, 'keyup', this.handleKeyUp)
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

