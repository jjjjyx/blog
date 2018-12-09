<template>
    <Modal v-model="visible" title="选择图片" width="90" class-name="image-modal-warp" :footer-hide="true" @on-cancel="handleClose">
        <media-curd @on-selection-change="handleSelectionChange" :selected-mode="selectedMode">
            <template slot-scope="slotProps">
                <div class="curd-container--flex__modal image-modal__select-info">
                    <template v-if="selected.length === 0">
                        <h2 class="title">
                            {{slotProps.total}} 个项目
                        </h2>
                        <p>&nbsp;</p>
                    </template>
                    <template v-else-if="isSingleSelect">
                        <h2 class="title" :title="selected[0].name">{{selected[0].name}}</h2>
                        <p>{{selected[0].mimeType}}</p>
                    </template>
                    <template v-else>
                        <h2 class="title">已选择 {{selected.length}} 个图片</h2>
                        <p>&nbsp;</p>
                    </template>
                    <div class="preview">
                        <img :src="item.url" alt="" v-for="item in previewList" :key="item.hash" class="item" :class="imageClass(item)">
                    </div>
                    <table v-if="selected.length">
                        <colgroup>
                            <col width="100">
                        </colgroup>
                        <tr>
                            <td>上传时间</td>
                            <td>{{selectedUploadTime}}</td>
                        </tr>
                        <tr>
                            <td>分辨率</td>
                            <td>{{selectedResolution}}</td>
                        </tr>
                        <tr>
                            <td>大小</td>
                            <td>{{selectedSize}}</td>
                        </tr>
                        <tr>
                            <td>目录</td>
                            <td>{{selectedSpace}}</td>
                        </tr>
                        <tr>
                            <td>颜色</td>
                            <td>
                                <div class="ivu-color-picker-picker-colors-wrapper" v-for="(item, index) in selectedColors" :key="index">
                                    <div class="ivu-color-picker-picker-colors-wrapper-color"
                                         :style="{'background': item}"></div>
                                    <!--<div class="ivu-color-picker-picker-colors-wrapper-circle"-->
                                    <!--:class="{'ivu-color-picker-hide': color }"></div>-->
                                </div>
                            </td>
                        </tr>
                    </table>
                    <div class="image-modal__footer">
                        <Button long class="mb-3" @click="cancel">取消</Button>
                        <Button type="success" long @click="confirmSelect">确认选择</Button>
                    </div>
                </div>
            </template>
        </media-curd>
    </Modal>
</template>

<script>
import { dateFormat, formatFileSize } from '@/utils/common'

export default {
    name: 'media-select',
    data: function () {
        return {
            visible: false,
            resolve: null,
            reject: null,
            selectedMode: false,
            selected: []
        }
    },
    computed: {
        imgSpaces: function () {
            return this.$store.getters.imgSpaces
        },
        isSingleSelect () {
            return this.selected.length === 1
        },
        previewList () {
            return this.selected.slice(0, 10)
        },
        selectedUploadTime () {
            if (!this.selected.length) return '-'
            if (this.isSingleSelect) {
                return dateFormat(this.selected[0].createdAt)
            } else {
                let times = this.selected.map((item) => new Date(item.createdAt)).sort((a, b) => b - a).map((item) => dateFormat(item))
                return [times[0], times[times.length - 1]].join(' - ')
            }
        },
        selectedResolution () {
            if (!this.selected.length) return '-'
            if (this.isSingleSelect) {
                return `${this.selected[0].width} * ${this.selected[0].height}`
            } else {
                return '多种规格'
            }
        },
        selectedSize () {
            return formatFileSize(this.selected.reduce((count, next) => count + next.size, 0))
        },
        selectedSpace () {
            let spaces = this.selected.map((item) => this.imgSpaces[item.space])
            return [...new Set(spaces)].join(', ')
        },
        selectedColors () {
            return [...new Set(this.selected.map((item) => item.color))].splice(0, 10)
        }
    },
    methods: {
        open ({ multiple = false } = {}) {
            this.selectedMode = multiple
            this.visible = true
            return new Promise((resolve, reject) => {
                this.resolve = resolve
                this.reject = reject
            })
        },
        cancel () {
            this.visible = false
            this.reject(new Error('Not selected'))
        },
        confirmSelect () {
            this.visible = false
            this.resolve(this.selected)
        },
        handleClose () {
            this.reject(new Error('Not selected'))
        },
        handleSelectionChange (selected) {
            this.selected = selected
        },
        imageClass (item) {
            let { width, height } = item
            if (width > height) {
                return 'item--width'
            } else {
                return 'item--height'
            }
        }
    }
}
</script>
