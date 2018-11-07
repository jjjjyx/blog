<template>
<div class="curd-container curd-container--flex medium__warp">
    <div class="curd-container--flex__left">
        <!--<div class="medium__img-opt">-->
        <Form ref="formItem" :model="formItem" :rules="ruleInline" inline class="medium__opt" @submit.prevent="handleSubmit">
            <div class="ivu-form-item">
                <label class="ivu-form-item-label">目录：</label>
            </div>
            <form-item prop="space" class="mr-4">
                <Select v-model="formItem.space" style="width:100px" placeholder="选择图片空间" @on-change="handleChangeImgSpace">
                    <Option v-for="(v, k) in imgSpaces" :value="k" :key="k">{{ v }}</Option>
                </Select>
            </form-item>

            <!--<div class="ivu-form-item">-->
                <!--<label class="ivu-form-item-label">hash：</label>-->
            <!--</div>-->
            <form-item prop="hash" class="mr-4">
                <Input v-model="formItem.hash" placeholder="关键字"/>
            </form-item>
            <!--<div class="ivu-form-item">-->
            <!--<label class="ivu-form-item-label">尺寸:</label>-->
            <!--</div>-->
            <form-item prop="size" class="mr-4">
                <!--<Select v-model="formItem.space" style="width:150px" placeholder="选择尺寸">-->
                <!--<Option :value="lg"></Option>-->
                <!--</Select>-->
                <Dropdown @on-click="(val) => formItem.size = val">
                    <a href="javascript:void(0)">
                        {{sizeText}}
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownMenu >
                            <DropdownItem @click.native="formItem.size = ''">全部尺寸</DropdownItem>
                        </DropdownMenu>
                        <DropdownItem v-for="(v, k) in sizeLabels" :key="k" :name="k">{{v}}</DropdownItem>
                        <Dropdown placement="right-start">
                            <DropdownItem>预设<Icon type="ios-arrow-forward"></Icon></DropdownItem>
                            <DropdownMenu slot="list">
                                <DropdownItem v-for="item in presetSize" :key="item" :name="item">{{item}}</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </DropdownMenu>
                </Dropdown>
            </form-item>
            <!--<div class="ivu-form-item">-->
            <!--<label class="ivu-form-item-label">色调：</label>-->
            <!--</div>-->
            <form-item prop="color" class="mr-4">
                <Poptip v-model="colorPanelVisible" placement="bottom">
                    <a href="javascript:void(0)">
                        <div class="ivu-color-picker-picker-colors-wrapper" v-if="activeColor" style="float: none;display: inline-block; vertical-align: middle;    width: 18px; height: 18px;">
                            <div class="ivu-color-picker-picker-colors-wrapper-color" :style="{'background': activeColor.color, margin: 0}"></div>
                        </div>
                        <span>{{activeColor ? activeColor.text: '全部颜色'}}</span>
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <div slot="content">
                        <DropdownMenu >
                            <DropdownItem @click.native="formItem.color = '', activeColor = null, colorPanelVisible = false">全部颜色</DropdownItem>
                        </DropdownMenu>
                        <div class="ivu-color-picker-picker-colors">
                            <div class="ivu-color-picker-picker-colors-wrapper"
                                 :title="item.text" v-for="(item, index) in presetColors" :key="index" @click="formItem.color = item.text, activeColor = item, colorPanelVisible = false">
                                <div class="ivu-color-picker-picker-colors-wrapper-color" :style="{'background': item.color}"></div>
                                <div class="ivu-color-picker-picker-colors-wrapper-circle" :class="{'ivu-color-picker-hide':item.color }"></div>
                            </div>
                        </div>
                    </div>

                </Poptip>
            </form-item>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formItem')">搜索</Button>
            </FormItem>
            <FormItem class="float-right">
                <Tooltip content="原生空间管理">
                    <Button type="text" icon="soup-can"></Button>
                </Tooltip>
                <Button  @click="clearInvalidImg" class="mr-2">清除失效图片</Button>
                <Button type="primary" @click="handleUpload">上传新图片</Button>
            </FormItem>
        </Form>
        <!--</div>-->
        <img-grid @move-img="moveImg" :data="data"></img-grid>
    </div>
    <!--<div class="cm-container&#45;&#45;flex__modal medium__right">-->
        <!--<h2 class="ivu-card-head" >-->
            <!--图片信息-->
        <!--</h2>-->
        <!--<div style="height: 100%;overflow: auto">-->
           <!--<pre>{{selectedList}}</pre>-->
        <!--</div>-->

    <!--</div>-->
    <form class="h5-uploader-form" action="javascript:void(0);" @change="handleUploadChange" style="position: absolute; opacity: 0; top: -999px; left: 0; width: 0%; height: 0; cursor: pointer; opacity: 0;">
        <input title="点击选择文件" id="h5Input0" ref="h5Input0" multiple accept="image/*" type="file" name="html5uploader"
               style="position:absolute;opacity:0;top:0;left:0;width:100%;height:100%;cursor:pointer;">
    </form>
    <pswp ref="pswp"></pswp>
</div>
</template>

<script>
import difference from 'lodash/difference'
import {mapGetters} from 'vuex'

import pswp from '@/components/pswp/pswp.vue'
import {getMetaKeyCode} from '@/utils/common'
import {on, off} from '@/utils/dom'

import ImgGrid from './img-grid'
import * as media from '../../api/media'



const sizeLabels = {
    '9': '特大尺寸',
    '8': '大尺寸',
    '7': '中尺寸',
    '6': '小尺寸'
}
export default {
    // mixins: [crud],
    name: 'media-management',
    data () {

        return {
            formItem: {
                space: 'all',
                hash: '',
                size: '',
                color: null
            },
            ruleInline: {},
            idKey: 'hash',
            active: 'img',
            sizeLabels,
            presetSize: ['1920x1080', '1680x1050', '1440x900', '1366x768', '1280x1024', '1280x800', '1024x768'],
            presetColors: [
                {color: '#DE2020', text: '红色'},
                {color: '#FE6C00', text: '橙色'},
                {color: '#FEBF00', text: '黄色'},
                {color: '#59A725', text: '绿色'},
                {color: '#892BCF', text: '紫色'},
                {color: '#D744BA', text: '粉色'},
                {color: '#06B7C8', text: '青色'},
                {color: '#0065FE', text: '蓝色'},
                {color: '#733413', text: '棕色'},
                {color: '#ffffff', text: '白色'},
                {color: '#000000', text: '黑色'},
                {
                    color: 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOAgMAAABiJsVCAAAACVBMVEWAgIAxMDBPTk4kb9ZpAAAAJ0lEQVQI1xXEsREAMAwCMS8JR8kojJ68Ct3uK4VMGpVCJo1KIZNGfT5iC4W3w7w9AAAAAElFTkSuQmCC\') 1px 1px no-repeat',
                    text: '黑白'
                }
            ],
            activeColor: null,

            colorPanelVisible: false,
            // isBusy: false,
            isNext: true,
            data: [],
            currPage: 1,
            scrollHeight: 300
        }
    },
    components: {
        ImgGrid,
        pswp
        // Waterfall,
        // WaterfallSlot
    },
    computed: {
        ...mapGetters({
            imgSpaces: 'imgSpaces'
        }),
        sizeText () {
            if (this.formItem.size) {
                return sizeLabels[this.formItem.size] ? sizeLabels[this.formItem.size] : this.formItem.size
            } else {
                return '选择尺寸'
            }
        },
        selectedList: function () {
            return this.data.filter(item => item._checked)
        },
        selectedNum: function () {
            return this.selectedList.length
        }
    },
    methods: {
        _handleKeyDown: function (e) {
            let keyCode = getMetaKeyCode(e)
            switch (keyCode) {
                case 4113: // 按下了 ctrl
                case 16400: // 按下了 shift
                case 20497: // 同时按下了 shift ctrl
                case 20496: // 同时按下了 ctrl shift
                    this.keydownCode = keyCode
                    break
                case 116: // 按下了F5
                    // this.fetchMedia()
                    // e.preventDefault()
                    break
                default:
                    this.keydownCode = null
            }
        },
        async fetchMedia () {
            if (!this.isNext) return false
            try {
                let result = await media.fetchAll({...this.formItem, color: this.activeColor && this.activeColor.color}, this.currPage)
                result.forEach(i => {
                    i._checked = false
                    // 图片查看查询所需要的属性
                    i.src = i.url
                    i.w = i.width
                    i.h = i.height
                })
                if (result.length === 0) {
                    this.isNext = false
                    this.$Message.info('没有更多了呢')
                } else {
                    this.currPage++
                    this.data.push(...result)
                }
            } catch (e) {
                this.$Message.error('获取资源数据失败')
            }
        },
        // 提交搜索表单
        handleSubmit () {
            this.handleChangeImgSpace()
        },
        // 点击图片列表
        handleMouseDownImg (e, item) {
            this.data.forEach(i => {
                i._checked = false
            })
            item._checked = true
            // item._checked
        },

        // 切换图片空间
        handleChangeImgSpace () {
            this.isNext = true
            this.currPage = 1
            this.data = []
            this.fetchMedia()
        },
        // 清除失效图片，包括缓存
        clearInvalidImg () {},
        handleUpload: function () { // name = 'file'
            // upload.openSelectFile(name)
            // if (name === 'folder') { // 选择文件夹
            //     // this.$Notice.open({
            //     //     title: '通知',
            //     //     desc: '上传文件夹暂时不可用'
            //     // })
            //     this.$refs.h5Input0.setAttribute('webkitdirectory', true)
            //     this.$refs.h5Input0.setAttribute('directory', true)
            //     // return
            // } else {
            //     this.$refs.h5Input0.removeAttribute('webkitdirectory')
            //     this.$refs.h5Input0.removeAttribute('directory')
            // }
            this.$refs.h5Input0.click()
        },
        handleUploadChange: async function (e) {
            const files = e.target.files
            if (!files) {
                return
            }
            let postFiles = Array.prototype.slice.call(files)
            // this.uploadFiles(files);
            let data = {'x:space': this.formItem.space}

            let token = await media.token()

            this.$uploadFiles(postFiles, {
                space: this.formItem.space,
                token,
                data,
                onSuccess: (res) => {
                    console.log(res)
                }
            })
            this.$refs.h5Input0.value = null
            // console.log(files)
        },
        _getSelectImages (target) {
            let key
            let items = []
            if (target) {
                key = target.getAttribute('data-key')
                // if (this.formItem.space !== 'all') {
                let item = this.data.find(item => item.hash === key)
                item && items.push(item)
                // }
            } else {
                items = this.selectedList
            }
            return items
        },
        async delImg (target) {
            let items = this._getSelectImages(target)
            let key = items.map(item => item.hash)
            try {
                await media.deleteImg(key[0])
                // if (this.formItem.space !== 'all') {
                this.data = difference(this.data, items)
                // }
            } catch (e) {
                this.$Message.info('删除失败')
            }
        },
        async moveImg (target, space) {
            let items = this._getSelectImages(target)
            let key = items.map(item => item.hash)
            try {
                await media.move(key, space)
                if (this.formItem.space !== 'all') {
                    this.data = difference(this.data, items.filter(item => item.space !== space))
                }
                this.$Message.success('完成移动')
            } catch (e) {
                this.$Message.info('移动失败')
            }

            // console.log('space', target , space)
        }
    },
    async created () {
        await this.fetchMedia()
        on(document.body, 'keydown', this._handleKeyDown)
    },
    destroyed () {
        off(document.body, 'keydown', this._handleKeyDown)
    }
}
</script>
