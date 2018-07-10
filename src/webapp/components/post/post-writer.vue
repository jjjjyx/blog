<template>
    <div class="post-writer-content">
        <div class="post-body-content">
            <div class="post-title-wrap">
                <input type="text" class="title" v-model="postTitle" placeholder="请输入一个标题">
                <div class="post-title-options table-buttons">
                    <tooltip content="新笔记">
                        <i-button type="text" icon="plus-round"></i-button>
                    </tooltip>
                    <tooltip content="标签">
                        <i-button type="text" icon="pricetags" @click="tagWrapShow = !tagWrapShow"></i-button>
                    </tooltip>
                    <tooltip content="附件">
                        <i-button type="text">
                            <i class="iconfont icon-fujian"></i>
                        </i-button>
                    </tooltip>
                    <tooltip content="笔记属性">
                        <i-button type="text" icon="information-circled"></i-button>
                    </tooltip>
                    <tooltip content="关闭">
                        <i-button type="text" icon="close-round"></i-button>
                    </tooltip>
                </div>
                <!-- todo 保存反馈 -->
                <!--<span class="saving-notice">{{currentStatus}}</span>-->
            </div>
            <collapse-transition>
                <!---->
            <div class="post-tag-wrap" v-show="tagWrapShow">
                <span class="align-middle mr-2">标签</span>
                <Poptip placement="bottom-start" width="200" transfer>
                    <Button icon="ios-plus-empty" type="dashed" size="small" ></Button>
                    <div class="post-tag-list" slot="content">
                        <CheckboxGroup v-model="selectedTag" @on-change="handleSelectTag">
                            <Checkbox :label="tag.name" v-for="(tag,index) in tagsList" :key="index">{{tag.name}}</Checkbox>
                        </CheckboxGroup>
                    </div>
                </Poptip>
                <Tag v-for="(item, index) in selectedTag" :key="index" :name="item" closable @on-close="$store.commit('splicePostTag',index)">{{item}}</Tag>
                <Tag v-for="(item, index) in newTag" :key="item" :name="item" closable @on-close="newTag.splice(index, 1)">{{item}}</Tag>
                <input class="input-tag" autocomplete="off" tabindex="0" type="text" ref="tagInput" v-model="newTagValue" placeholder="点击此处添加标签" @keyup.enter="addTag">
            </div>
            </collapse-transition>
            <div class="post-markdown-wrap">
                <mavon-editor style="height: 100%" :value="currentPost.post_content" ref="md"
                              @change="handleMdChange"
                              @save="handleMdSave"
                              @imgAdd="uploadImg" @imgDel="imgDel"></mavon-editor>
            </div>
        </div>
        <div class="postbox-container">
            <!--{{currentPost}}-->
            <draggable :list="sidebarsOrder" class="dragArea" >
                <transition-group type="transition" :name="'flip-list'">
                    <sidebar-panel v-for="sidebar in sidebarsOrder" :key="sidebar" class="postbox">
                        <template slot="title">{{$options.components[sidebar].title}}</template>
                        <components :is="sidebar" :current-post="currentPost"></components>
                    </sidebar-panel>
                </transition-group>
            </draggable>
        </div>
        <Modal v-model="saveTipModel" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>离开提示</span>
            </p>
            <div >
                是否保存当前文章？
            </div>
            <div slot="footer">
                <Button type="ghost" @click="resolve && resolve(), saveTipModel = false">保存</Button>
                <Button @click="reject && reject('no'), saveTipModel = false">不保存</Button>
                <Button @click="reject && reject('cancel'), saveTipModel = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>

import _ from 'lodash'
import SparkMD5 from 'spark-md5'
import draggable from 'vuedraggable'
import {mapActions, mapGetters, mapState} from 'vuex'
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import api from '@/utils/api'
import ajax from '@/utils/ajax'
import CollapseTransition from '@/utils/collapse-transition'
import {verification, getMetaKeyCode} from '@/utils/common'
import {on, off} from '@/utils/dom'

import sidebars from './sidebar'
import sidebarPanel from './sidebar/sidebar.vue'
// import {on} from '@/utils/dom'
// import { Base64 } from 'js-base64'
const sidebarsOrder = Object.keys(sidebars)

function fileMd5 (file) {
    return new Promise((resolve, reject) => {
        // let file = file_blob.file;
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlicelet
        // 截取部分数据
        let chunkSize = 1024 * 128 // Read in chunks of 1M
        let spark = new SparkMD5.ArrayBuffer()
        let fileReader = new FileReader()
        fileReader.onload = function (e) {
            spark.append(e.target.result) // Append array buffer\
            let md5 = spark.end()
            console.log('md5', md5)
            resolve(md5)
        }
        fileReader.onerror = function () {
            console.warn('oops, something went wrong.')
            reject(new Error('oops, something went wrong.'))
        }
        fileReader.readAsArrayBuffer(blobSlice.call(file, 0, chunkSize))
    })
}

const POST_WRITER_STATUS = {
    normal: '',
    save: '已保存',
    saveing: '保存中',
    edit: '已修改 - 未保存',
    auto_draft: '自动草稿'
}

export default {
    name: 'post-writer',
    data () {
        return {
            maxTagLength: 16,
            tagWrapShow: true,
            newTagValue: '',
            newTag: [],
            // value: '',
            currentStatus: POST_WRITER_STATUS.normal,
            sidebarsOrder,

            saveTipModel: false
        }
    },
    components: {
        mavonEditor,
        draggable,
        CollapseTransition,
        sidebarPanel,
        ...sidebars
    },
    computed: {
        ...mapState({
            'currentPost': state => state.post_writer
        }),
        ...mapGetters(['tagsList', 'showLeaveTip']),
        categoryValue: {
            get () { return this.$store.state.post_writer.categoryValue },
            set (value) { this.$store.commit('updateCategoryValue', value) }
        },
        postTitle: {
            get () { return this.$store.state.post_writer.post_title },
            set (value) { this.$store.commit('updatePostTitle', value) }
        },
        postContent: {
            get () { return this.$store.state.post_writer.post_content },
            set (value) { this.$store.commit('updatePostContent', value) }
        },
        renderValue: {
            get () { return this.$store.state.post_writer.render_value },
            set (value) { this.$store.commit('updateRenderValue', value) }
        },
        selectedTag: {
            get () { return this.$store.state.post_writer.tags },
            set (value) { this.$store.commit('updateTags', value) }
        },
        currTagLength: function () {
            return this.selectedTag.length + this.newTag.length
        }
    },
    methods: {
        ...mapActions({
            'fetchTerms': 'fetchTerms',
            'fetchData': 'fetchPostInfo'
        }),
        checkTagLength () {
            if (this.currTagLength >= this.maxTagLength) {
                return false
            }
            return true
        },
        handleSelectTag () {
            if (!this.checkTagLength()) {
                this.$Message.info('标签太多啦')
                // this.selectedTag.shift()
                this.$store.commit('shiftPostTag')
            }
        },
        addTag () {
            // let r = this.tagList.find((item)=>item.name==this.text);
            // 添加标签，添加的标签只是暂时存放，在未保存文章前不会保存到数据库
            if (!this.checkTagLength()) {
                this.$Message.info('标签太多啦')
            } else if (!verification(this.newTagValue)) {
                this.$Message.info('请提交正确的标签名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！')
            } else if (this.newTag.indexOf(this.newTagValue) >= 0) { // 是否重复
                console.log('重复的标签')
            } else {
                let tag = this.tagsList.find((item) => (item.name === this.newTagValue))
                if (tag) {
                    // this.selectedTag.push(tag.name)
                    this.$store.commit('pushPostTag')
                } else {
                    this.newTag.push(this.newTagValue)
                }
            }
            this.newTagValue = ''
        },
        qiniuUpload: function (file) {
            return new Promise(async (resolve, reject) => {
                try {
                    let md5 = await fileMd5(file)
                    // 3 = post/img/
                    let tokenParam = {md5, prefix: 3}
                    let result = await api.nget('/api/img/token', tokenParam)
                    let {token, domain, key} = result
                    // key = Base64.encode(key)
                    let url = `http://up-z2.qiniu.com/putb64/${file.size}/key/${key}`

                    ajax({
                        headers: {
                            'Authorization': `UpToken ${token}`,
                            'Content-Type': 'application/octet-stream'
                        },
                        isBase64: true,
                        file: file.miniurl,
                        action: url,
                        onProgress: e => {
                            // 文章图片都是小图片 ，不允许上传太大的 超过2M 的
                            console.log('onProgress', e)
                            // this.handleProgress(e, file)
                        },
                        onSuccess: res => {
                            // this.handleSuccess(res, file)
                            let hash = res.key
                            resolve(domain + hash)
                        },
                        onError: (err, response) => {
                            // this.handleError(err, response, file)
                            // console.log('onError', err, response)
                            reject(err)
                        }
                    })
                } catch (e) {
                    reject(new Error('获取上传凭证失败！'))
                }
            })
        },
        async uploadImg (pos, file) {
            // console.log(pos, file)
            let failCall = (msg) => {
                // 给出提示信息，
                this.$Message.info(msg)

                let imgList = this.$refs.md.$refs.toolbar_left.img_file
                let index = imgList.findIndex((img) => {
                    return img[1] === pos
                })
                // 解决连续删除错误的问题
                // 删除图片
                let delImg = imgList.splice(index, 1)[0]
                this.$refs.md.$refs.toolbar_left.$emit('imgDel', delImg)
                // this.$refs.md.$refs.toolbar_left.s_img_dropdown_open = false
            }
            try {
                let result = await this.qiniuUpload(file)
                // console.log('上传成功', result)
                file.url = result
                this.$refs.md.$img2Url(pos, result)
            } catch (e) {
                // 上传失败
                failCall(e.message)
            }
        },
        imgDel (file) {
            console.log('del img', file)
        },
        handleClose (name) {
            console.log('handleClose', name)
            // let index = list.indexOf(name)
            // // const index = this.count.indexOf(name)
            // list.splice(index, 1)
        },
        handleClose2 (name) {
            console.log('handleClose2', name)

            let index = this.newTag.indexOf(name)
            console.log(index)
            // // const index = this.count.indexOf(name)
            this.newTag.splice(index, 1)
        },
        handleMdChange (value, render) {
            // console.log(value, value === this.currentPost.post_content)
            if (value && value !== this.currentPost.post_content) {
                // this.showLeaveTip =
                this.currentStatus = POST_WRITER_STATUS.edit
            } else {
                this.currentStatus = POST_WRITER_STATUS.normal
            }
        },
        async handleMdSave (value, render) {
            // title 绑定了
            // this.currentPost.post_title =
            // this.currentStatus = POST_WRITER_STATUS.saveing
            this.$store.commit('updateCurrentPostStatus', POST_WRITER_STATUS.saveing)
            this.postContent = value
            this.renderValue = render
            // this.currentPost.render_value = render
            let obj = Object.assign({}, this.currentPost)
            obj.category_id = this.categoryValue
            obj.new_tag = this.newTag.concat(this.selectedTag)
            // 保存的时候不需要提交分类
            try {
                await api.npost('/api/post/save', obj)
                // console.log('save result = ', result)
                this.pushRouter('replace')
                this.$store.commit('updateCurrentPostStatus', POST_WRITER_STATUS.save)
            } catch (e) {
                this.$Message.info('保存失败')
                this.$store.commit('updateCurrentPostStatus', POST_WRITER_STATUS.edit)
            }
        },
        pushRouter (mode = 'push') {
            let id = this.currentPost.id
            this.$router[mode]({
                query: {
                    poi: id
                }
            })
        },
        leaveConfirm () {
            return new Promise((resolve, reject) => {
                this.saveTipModel = true
                this.resolve = resolve
                this.reject = reject
            })
        },
        handleKeyUp (e) {
            let keyCode = getMetaKeyCode(e)

            switch (keyCode) {
            case 4179:
                e.preventDefault()
                e.stopPropagation()
                // 保存
                let target = e.target
                // 如果对象是编辑框则退出 这个事件已经被处理了
                if (target.nodeName === 'TEXTAREA') {
                    return
                }
                let value = this.$refs.md.d_value
                let render = this.$refs.md.d_render
                this.handleMdSave(value, render)
                break
            }
        }
    },
    watch: {
        currentStatus: function (val) {
            if (this.showLeaveTip) {
                window.onbeforeunload = function () {
                    return '确认离开页面，当前修改将会丢弃'
                }
            } else {
                window.onbeforeunload = null
            }
        }
    },
    async created () {
        this.fetchTerms(false)
    },
    async beforeRouteUpdate (to, f, next) {
        next()
        // // 更新路由前检查是否保存
        // if (this.showLeaveTip) {
        //     this.leaveConfirm(next)
        // } else {
        //     // console.count('asd')
        //     let query = to.query
        //     let result = await this.fetchData(query)
        //     console.log('beforeRouteUpdate', result)
        //         // this.pushRouter('replace')
        //     // }
        //     // next()
        // }
    },
    async beforeRouteEnter (to, from, next) {
        next((vm) => {
            // await vm.fetchData(to.query)
            // vm.pushRouter('replace')
            let {poi} = to.query
            if (_.toNumber(poi) !== vm.currentPost.id) { // 不相等的情况
                // 获取新提交的poi 信息
                vm.fetchData(poi).then((result) => {
                    // 获取成功 不进行操作， 获取失败
                    if (!result) {
                        if (!vm.currentPost.id) {
                            vm.$router.push({
                                name: 'post_management'
                            })
                        } else {
                            vm.pushRouter('replace')
                        }
                    }
                })
            }

            vm._handleKeyUp = vm.handleKeyUp.bind(vm)
            on(document.body, 'keydown', vm._handleKeyUp)
        })
    },
    async beforeRouteLeave (to, from, next) {
        off(document.body, 'keydown', this._handleKeyUp)
        if (this.showLeaveTip) {
            try {
                await this.leaveConfirm(next)
                // 点击保存，
                let value = this.$refs.md.d_value
                let render = this.$refs.md.d_render
                this.handleMdSave(value, render)
                next()
            } catch (e) {
                if (e === 'cancel') {
                    // 点击取消
                    next(false)
                } else {
                    next()
                }
            }
        } else {
            next()
        }
    },
    mounted () {
        // console.log(this.$refs.md)
        // 当前页面中按ctrl + s

        // 直接进入 创建新文章
        // 进入时带id 参数 检查id 参数 是文章加载文章内容，不是创建新文章
        // 页面中路由被更新 检查是否有改动，有改动询问，无改动，跳转

        // let vNoteTextarea = this.$refs.md.$refs.vNoteTextarea;
        // let vTextarea = vNoteTextarea.$refs.vTextarea;
        // console.log(vTextarea)
        // // this.$nextTick(()=>{
        // //
        // // })
        // on(vTextarea,'paste', async function (e) {
        //     var clipboardData = e.clipboardData;
        //     if (clipboardData) {
        //         for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
        //             let item = e.clipboardData.items[i];
        //             if (item.kind === "file" && item.type == 'image/png') {
        //                 let pasteFile = item.getAsFile();
        //                 console.log(pasteFile)
        //                 // self.qiniuUpload(pasteFile,(key,domain)=>{
        //                 //     let img = `![](${domain}${key})\n`;
        //                 //     self.editormd.insertValue(img);
        //                 // })
        //             }
        //         }
        //     }
        // })
    }
}
</script>
