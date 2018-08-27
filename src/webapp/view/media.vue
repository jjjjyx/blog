<template>
<div class="cm-container cm-container--flex medium__warp">
    <div class="cm-container--flex__left">
        <!--<div class="medium__img-opt">-->
        <Form ref="formItem" :model="formItem" :rules="ruleInline" inline class="medium__opt">
            <div class="ivu-form-item">
                <label class="ivu-form-item-label">目录：</label>
            </div>
            <form-item prop="space" class="mr-4">
                <Select v-model="formItem.space" style="width:100px" placeholder="选择图片空间">
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
                        <DropdownItem v-for="(v, k) in sizeLabels" :key="k" :name="k">{{v}}</DropdownItem>
                        <Dropdown placement="right-start">
                            <DropdownItem>
                                预设
                                <Icon type="ios-arrow-forward"></Icon>
                            </DropdownItem>
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
                <Button type="primary" @click="handleUpload">上传新图片</Button>
            </FormItem>
        </Form>
        <!--</div>-->
        <div class="medium__img" ref="imgs" v-context-menu="contentItems">
            <waterfall :line-gap="216" :watch="data" @reflowed="isBusy = false" ref="waterfall">
                <!-- each component is wrapped by a waterfall slot -->
                <waterfall-slot v-for="(item, index) in data" :width="item.width" :height="item.height" :order="index" :key="index">
                    <div class="img__item" :class="{active: item._checked}" @click="item._checked = !item._checked">
                        <img :src="item.url" alt="">
                    </div>
                </waterfall-slot>
            </waterfall>
            <div class="medium__img--not-more" v-if="!isNext">
                没有更多了
            </div>
        </div>
    </div>
    <div class="cm-container--flex__modal medium__right">
        <h2 class="ivu-card-head" >
            图片信息
        </h2>
        <div style="height: 100%;overflow: auto">
           {{selectedList}}
        </div>

    </div>
    <form class="h5-uploader-form" action="javascript:void(0);" @change="handleUploadChange" style="position: absolute; opacity: 0; top: -999px; left: 0; width: 0%; height: 0; cursor: pointer; opacity: 0;">
        <input title="点击选择文件" id="h5Input0" ref="h5Input0" multiple accept="image/*" type="file" name="html5uploader"
               style="position:absolute;opacity:0;top:0;left:0;width:100%;height:100%;cursor:pointer;">
    </form>
</div>
</template>

<script>
import Waterfall from 'vue-waterfall/lib/waterfall'
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
import {mapGetters, mapActions, mapState} from 'vuex'
import {on} from '../utils/dom'
// import crud from '@/components/curd'
// <!--mapState mapActions-->
import api from '@/utils/api'
// {
//     "hash": "Fg2ZZ0VmdYVnj8CsFy1-BGgmcsml",
//     "key": "Fg2ZZ0VmdYVnj8CsFy1-BGgmcsml",
//     "name": "1_120403103421_5.jpg",
//     "size": 61624,
//     "color": "#525b64",
//     "uuid": "a60bcf7d-973e-4282-9123-913f052268f2",
//     "mimeType": "image/jpeg",
//     "bucket": "jyximg",
//     "url": "http://oht47c0d0.bkt.clouddn.com/Fg2ZZ0VmdYVnj8CsFy1-BGgmcsml",
//     "width": 740,
//     "height": 462,
//     "space": "public",
//     "createdAt": "2018-08-12T17:18:49.000Z",
//     "_checked": false
// },
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
                size: ''
            },
            ruleInline: {},
            idKey: 'hash',
            active: 'img',
            sizeLabels,
            presetSize: ['1920x1080', '1680x1050', '1440x900', '1366x768', '1280x1024', '1280x800', '1024x768'],
            activeColor: null,
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
            colorPanelVisible: false,
            isBusy: false,
            isNext: true,
            data: [],
            currPage: 1,
            contentItems: [
                {
                    label: '查看',
                    get disabled () {
                        return this.selectedNum
                    },
                    callback: (e) =>{
                        console.log(12312, e)
                    }
                },
                {
                    label: '复制链接'
                },
                {
                    label: '复制 markdown 链接'
                },
                {
                    label: '移动到其他目录',
                    child: [
                        {
                            label: '目录二',
                            callback: (e) =>{
                                console.log(12312, e)
                            }
                        },
                        {
                            label: '目录三'
                        },
                        {
                            label: '目录四'
                        }
                    ]
                },
                {
                    divided: true,
                    label: '删除'
                }
            ]
        }
    },
    components: {
        Waterfall,
        WaterfallSlot
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
        },
    },
    methods: {
        // ...mapActions({'fetchMedia': 'fetchMedia'}),
        async fetchMedia () {
            try {
                let result = await api.nget('/api/img/list', {page: this.currPage})
                result.forEach(i => (i._checked = false))
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
        async fetch () {
            if (!this.isBusy) {
                this.isBusy = true
                this.fetchMedia()
                // this.items.push.apply(this.items, ItemFactory.get(50))
            }
            // await this._fetch(this.page)
            // this.page++
        },
        handleSubmit () {
        },
        handleUpload: function (name = 'file') {
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
            let token = await api.nget('/api/img/token')

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
        cancel () {},
    },
    created () {
        this.fetch()
    },
    mounted () {
        on(this.$refs.imgs, 'scroll', () => {
            let scrollTop = this.$refs.imgs.scrollTop
            if (scrollTop + this.$refs.imgs.clientHeight >= this.$refs.waterfall.$el.clientHeight) {
                this.fetch()
            }
        })
    }
}
</script>
