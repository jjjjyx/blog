<template>
    <div class="curd-container curd-container--flex medium__warp">
        <div class="curd-container--flex__left">
            <!--<div class="medium__img-opt">-->
            <Form ref="formItem" :model="formItem" :rules="ruleInline" inline class="medium__opt"
                  @submit.prevent="handleSubmit">
                <div class="ivu-form-item">
                    <label class="ivu-form-item-label">目录：</label>
                </div>
                <form-item prop="space" class="mr-4">
                    <Select v-model="formItem.space" style="width:100px" placeholder="选择图片空间" @on-change="handleChangeImgSpace">
                        <Option v-for="(v, k) in imgSpaces" :value="k" :key="k">{{ v }}</Option>
                    </Select>
                </form-item>

                <form-item prop="hash" class="mr-4">
                    <i-input v-model="formItem.hash" placeholder="关键字"></i-input>
                </form-item>
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
                            <DropdownMenu>
                                <DropdownItem @click.native="formItem.size = ''">全部尺寸</DropdownItem>
                            </DropdownMenu>
                            <DropdownItem v-for="(v, k) in sizeLabels" :key="k" :name="k">{{v}}</DropdownItem>
                            <Dropdown placement="right-start">
                                <DropdownItem>预设
                                    <Icon type="ios-arrow-forward"></Icon>
                                </DropdownItem>
                                <DropdownMenu slot="list">
                                    <DropdownItem v-for="item in presetSize" :key="item" :name="item">{{item}}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </DropdownMenu>
                    </Dropdown>
                </form-item>

                <form-item prop="color" class="mr-4">
                    <Poptip v-model="colorPanelVisible" placement="bottom">
                        <a href="javascript:void(0)">
                            <div class="ivu-color-picker-picker-colors-wrapper" v-if="activeColor"
                                 style="float: none;display: inline-block; vertical-align: middle;    width: 18px; height: 18px;">
                                <div class="ivu-color-picker-picker-colors-wrapper-color"
                                     :style="{'background': activeColor.color, margin: 0}"></div>
                            </div>
                            <span>{{activeColor ? activeColor.text: '全部颜色'}}</span>
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <div slot="content">
                            <DropdownMenu>
                                <DropdownItem
                                    @click.native="formItem.color = '', activeColor = null, colorPanelVisible = false">
                                    全部颜色
                                </DropdownItem>
                            </DropdownMenu>
                            <div class="ivu-color-picker-picker-colors">
                                <div class="ivu-color-picker-picker-colors-wrapper"
                                     :title="item.text" v-for="(item, index) in presetColors" :key="index"
                                     @click="formItem.color = item.text, activeColor = item, colorPanelVisible = false">
                                    <div class="ivu-color-picker-picker-colors-wrapper-color"
                                         :style="{'background': item.color}"></div>
                                    <div class="ivu-color-picker-picker-colors-wrapper-circle"
                                         :class="{'ivu-color-picker-hide': item.color }"></div>
                                </div>
                            </div>
                        </div>
                    </Poptip>
                </form-item>
                <FormItem>
                    <Button @click="handleSubmit('formItem')" type="primary" class="mr-2">搜索</Button>
                    <!--<Tooltip content="原生空间管理">-->
                    <!--<Button type="text" icon="soup-can"></Button>-->
                    <!--</Tooltip> :loading="detectLoading"-->
                    <Button @click="clearInvalidImg" class="mr-2" >探测失效图片</Button>
                    <Button @click="sync" class="mr-2" :loading="syncLoading">同步本地图片</Button>
                    <Button @click="handleUpload" type="primary">上传新图片</Button>
                </FormItem>
                <FormItem class="float-right">

                </FormItem>
            </Form>
            <!--</div>-->
            <img-grid :data="data" v-context-menu="{menus: contentItems, targetEl: '.img__item'}"></img-grid>
        </div>
        <!--<div class="cm-container&#45;&#45;flex__modal medium__right">-->
        <!--<h2 class="ivu-card-head" >-->
        <!--图片信息-->
        <!--</h2>-->
        <!--<div style="height: 100%;overflow: auto">-->
        <!--<pre>{{selectedList}}</pre>-->
        <!--</div>-->

        <!--</div>-->
        <form class="h5-uploader-form" action="javascript:void(0);" @change="handleUploadChange"
              style="position: absolute; opacity: 0; top: -999px; left: 0; width: 0%; height: 0; cursor: pointer; opacity: 0;">
            <input title="点击选择文件" id="h5Input0" ref="h5Input0" multiple accept="image/*" type="file"
                   name="html5uploader"
                   style="position:absolute;opacity:0;top:0;left:0;width:100%;height:100%;cursor:pointer;">
        </form>
        <invalid-image :visible.sync="invalidImageModalVisible" :data.sync="invalidImageData"/>
        <input style="position: absolute;left: -999px;opacity: 0" ref="copyrelay"/>
    </div>
</template>

<script>
import difference from 'lodash/difference'
import { mapGetters } from 'vuex'
import * as media from '@/api/media'
// import { getMetaKeyCode } from '@/utils/common'
// import { on, off } from '@/utils/dom'

import ImgGrid from './components/img-grid'
import InvalidImage from './components/invalid-image'

const sizeLabels = {
    '9': '特大尺寸',
    '8': '大尺寸',
    '7': '中尺寸',
    '6': '小尺寸'
}
// const galleryOptions = {
//     shareEl: false,
//     history: false
// }

export default {
    // mixins: [crud],
    name: 'media-management',
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
            formItem: { space: 'all', hash: '', size: '', color: null },
            ruleInline: {},
            idKey: 'hash',
            active: 'img',
            sizeLabels,
            presetSize: ['1920x1080', '1680x1050', '1440x900', '1366x768', '1280x1024', '1280x800', '1024x768'],
            presetColors: [
                { color: '#DE2020', text: '红色' },
                { color: '#FE6C00', text: '橙色' },
                { color: '#FEBF00', text: '黄色' },
                { color: '#59A725', text: '绿色' },
                { color: '#892BCF', text: '紫色' },
                { color: '#D744BA', text: '粉色' },
                { color: '#06B7C8', text: '青色' },
                { color: '#0065FE', text: '蓝色' },
                { color: '#733413', text: '棕色' },
                { color: '#ffffff', text: '白色' },
                { color: '#000000', text: '黑色' },
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
            scrollHeight: 300,
            syncLoading: false,
            detectStatus: '',
            invalidImageModalVisible: false,
            invalidImageData: [],
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
        InvalidImage,
        ImgGrid
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
        async fetchMedia () {
            if (!this.isNext) return false
            try {
                let result = await media.fetchAll({
                    ...this.formItem,
                    color: this.activeColor && this.activeColor.color
                }, this.currPage)
                result.forEach(i => {
                    i._checked = false
                    // // 图片查看查询所需要的属性
                    // i.src = i.url
                    // i.w = i.width
                    // i.h = i.height
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

        // 切换图片空间
        handleChangeImgSpace () {
            this.isNext = true
            this.currPage = 1
            this.data = []
            this.fetchMedia()
        },
        $$startDetect () {
            this.detectStatus = 'detecting'
            this.taskId = setTimeout(this.$$detect, 3000)
        },
        $$detectStop () {
            clearTimeout(this.taskId)
            this.detectStatus = 'end'
            this.$Notice.close('detect_notice')
        },
        async $$detect () {
            if (this.detetProgress === 100) {
                return this.$$detectStop()
            }
            try {
                let data = await media.getDetectData()
                this.detetProgress = data.rate
                this.invalidImageData.push(...data.data)
                this.taskId = setTimeout(this.$$detect, 3000)
            } catch (e) {
                this.$Message.error('探测出现异常:' + e.message)
                return this.$$detectStop()
            }
        },
        // 清除失效图片，包括缓存
        async clearInvalidImg () {
            // 开始或者结束
            console.log(this.detectStatus === 'detecting' || this.detectStatus === 'end', this.detectStatus)
            if (this.detectStatus === 'detecting' || this.detectStatus === 'end') {
                this.invalidImageModalVisible = true
                return
            }
            this.detectStatus = 'start'
            this.$Notice.info({
                title: '提示',
                name: 'detect_notice',
                desc: '正在探测图片状态，请稍后！'
            })
            try {
                this.$$startDetect()
                await media.detect()
                // console.log(data)
                // this.invalidImageModalVisible = true
                // this.invalidImageData = data
            } catch (e) {
                if (e.code === 3) {
                    this.$Message.info(e.message)
                } else {
                    this.$Message.error('探测出现异常:' + e.message)
                    clearTimeout(this.taskId)
                    this.detectStatus = ''
                }
                // this.$Notice.close('detect_notice')
            }
        },
        async sync () {
            this.syncLoading = true
            try {
                this.$Notice.info({
                    title: '提示',
                    name: 'sync_notice',
                    desc: '正在同步，过程需要一些时间，请稍后！'
                })
                await media.sync()
                this.$Message.success('同步完成')
                this.data = []
                this.isNext = true
                this.currPage = 1
                this.fetchMedia() // 刷新当前空间
            } catch (e) {
                this.$Message.error('同步出现异常:' + e.message)
            } finally {
                this.syncLoading = false
                this.$Notice.close('sync_notice')
            }
        },
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
            let data = { 'x:space': this.formItem.space, 'x:remark': 'Local Upload' }

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
        async delImg (target) {
            let items = this._getSelectImages(target)
            let keys = items.map(item => item.hash)
            try {
                await media.deleteImg(keys)
                // if (this.formItem.space !== 'all') {
                this.data = difference(this.data, items)
                // }
            } catch (e) {
                this.$Message.info('删除失败')
            }
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
        openGallery (index) {
            let data = this.data.map(item => ({
                src: item.url,
                w: item.width,
                h: item.height
            }))

            this.$photoswipe.open(parseInt(index, 10), data)
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
        }
    },
    async created () {
        await this.fetchMedia()
    },
    destroyed () {
    }
}
</script>
