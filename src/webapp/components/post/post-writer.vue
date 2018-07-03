<template>
    <div class="post-writer-content">
        <div class="post-body-content">
            <div class="post-title-wrap">
                <input type="text" class="title" v-model="currentPost.post_title" placeholder="请输入一个标题">
                <!--<div class="post-title-options table-buttons">-->
                    <!--<tooltip content="标签">-->
                        <!--<i-button type="text" icon="pricetags" @click="tagWrapShow = !tagWrapShow"></i-button>-->
                    <!--</tooltip>-->
                    <!--<tooltip content="附件">-->
                        <!--<i-button type="text">-->
                            <!--<i class="iconfont icon-fujian"></i>-->
                        <!--</i-button>-->
                    <!--</tooltip>-->
                    <!--<tooltip content="笔记历史">-->
                        <!--<i-button type="text" icon="merge"></i-button>-->
                    <!--</tooltip>-->
                <!--</div>-->
                <span class="saving-notice">{{currentStatus}}</span>
            </div>
            <collapse-transition>
                <!--v-show="tagWrapShow"-->
            <div class="post-tag-wrap" >
                <span class="align-middle mr-2">标签</span>
                <Poptip placement="bottom-start" width="200" transfer>
                    <Button icon="ios-plus-empty" type="dashed" size="small" ></Button>
                    <div class="post-tag-list" slot="content">
                        <CheckboxGroup v-model="selectedTag" @on-change="handleSelectTag">
                            <Checkbox :label="tag.name" v-for="(tag,index) in tagsList" :key="index">{{tag.name}}</Checkbox>
                        </CheckboxGroup>
                    </div>
                </Poptip>
                <Tag v-for="(item, index) in selectedTag" :key="index" :name="item" closable @on-close="handleClose2(selectedTag, item)">{{item}}</Tag>
                <Tag v-for="(item, index) in newTag" :key="'a_'+index+item" :name="item" closable @on-close="handleClose2(newTag, item)">{{item}}</Tag>
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
            <draggable :list="sidebarsOrder" class="dragArea">
                <transition-group type="transition" :name="'flip-list'">
                    <sidebar-panel v-for="sidebar in sidebarsOrder" :key="sidebar" class="postbox">
                        <template slot="title">{{$options.components[sidebar].title}}</template>
                        <components :is="sidebar" :current-post="currentPost"></components>
                    </sidebar-panel>
                </transition-group>
            </draggable>
        </div>
    </div>
</template>

<script>

import SparkMD5 from 'spark-md5'
import draggable from 'vuedraggable'
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import api from '@/utils/api'
import ajax from '@/utils/ajax'
import CollapseTransition from '@/utils/collapse-transition'
import sidebars from './sidebar'
import sidebarPanel from './sidebar/sidebar.vue'
import {mapActions, mapGetters} from 'vuex'
import {verification} from '../../utils/common'
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
            tagWrapShow: false,
            newTagValue: '',
            // value: '',
            currentStatus: POST_WRITER_STATUS.normal,
            sidebarsOrder,
            // showLeaveTip: false,
            currentPost: {
                'comment_status': 'open',
                'ping_status': 'open',
                'menu_order': '0',
                'post_type': 'post',
                'comment_count': '0',
                'seq_in_nb': '0',
                'post_author': 1,
                'post_content': '',
                'post_title': '',
                'post_excerpt': '',
                'post_status': 'auto-draft',
                'post_name': '',
                'guid': '',
                'id': 0
            },
            selectedTag: [],
            newTag: []
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
        ...mapGetters(['tagsList']),
        currTagLength: function () {
            return this.selectedTag.length + this.newTag.length
        },
        showLeaveTip: function () {
            return this.currentStatus === POST_WRITER_STATUS.saveing || this.currentStatus === POST_WRITER_STATUS.edit
        }
    },
    methods: {
        ...mapActions(['fetchTerms']),
        checkTagLength () {
            if (this.currTagLength >= this.maxTagLength) {
                return false
            }
            return true
        },
        handleSelectTag () {
            if (!this.checkTagLength()) {
                this.$Message.info('标签太多啦')
                this.selectedTag.shift()
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
                // console.debug('添加标签', this.newTagValue)
                // 检查是否在已有列表中
                let tag = this.tagsList.find((item) => (item.name === this.newTagValue))
                if (tag) {
                    this.selectedTag.push(tag.name)
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
        handleClose2 (list, name) {
            let index = list.indexOf(name)
            // const index = this.count.indexOf(name)
            list.splice(index, 1)
        },
        handleMdChange (value, render) {
            // console.log(value, value === this.currentPost.post_content)
            if (value && value !== this.currentPost.post_content) {
                // this.showLeaveTip =
                this.currentStatus = POST_WRITER_STATUS.edit
            }

            // 做出了修改 并且文章内容不等于当前文章内容的时候
            // 给windows 绑定离开事件
            // if () {
            // } else {
            //     window.onbeforeunload = null
            // }
        },
        async handleMdSave (value, render) {
            // title 绑定了
            // this.currentPost.post_title =
            this.currentStatus = POST_WRITER_STATUS.saveing
            this.currentPost.post_content = value
            this.currentPost.render_value = render
            let obj = Object.assign({}, this.currentPost)
            obj.new_tag = this.newTag.concat(this.selectedTag)
            // 保存的时候不需要提交分类
            try {
                let result = await api.npost('/api/post/save', obj)
                console.log('save result = ', result)
                this.pushRouter('replace')
                this.currentStatus = POST_WRITER_STATUS.save
            } catch (e) {
                this.$Message.info('保存失败')
                this.currentStatus = POST_WRITER_STATUS.edit
            }
        },
        pushRouter (mode = 'push') {
            let id = this.currentPost.id
            if (id) {
                this.$router[mode]({
                    query: {
                        poi: id
                    }
                })
            }
        },
        leaveConfirm (next) {
            this.$Modal.confirm({
                title: '离开提示',
                okText: '确认离开',
                cancelText: '取消',
                content: '离开当前页面可能造成内容丢失，请谨慎！',
                onOk: () => {
                    next()
                },
                onCancel: () => {
                    this.$Message.info('取消离开')
                    next(false)
                }
            })
        }
    },
    watch: {
        currentStatus: function (val) {
            console.log(val, 'currentStatus', this.showLeaveTip)
            if (this.showLeaveTip) {
                window.onbeforeunload = function () {
                    return '确认离开页面，当前修改将会丢弃'
                }
            } else {
                window.onbeforeunload = null
            }
        }
    },
    // 路由的变化就不监听了 这个没有意义
    beforeRouteEnter (to, from, next) {
        next((vm) => {
            vm.pushRouter('replace')
        })
    },
    beforeRouteLeave (to, from, next) {
        if (this.showLeaveTip) {
            this.leaveConfirm(next)
        } else {
            next()
        }
    },
    async created () {
        // 创建新文章 - 自动草稿
        let {poi} = this.$route.query
        if (poi) {
            try {
                let result = await api.nget(`/api/post/${poi}`)
                this.currentPost = result
                this.selectedTag = result.tags || []
                this.currentStatus = POST_WRITER_STATUS.normal
            } catch (e) {

            }
        }

        if (this.currentPost.id === 0) {
            try {
                let result = await api.npost('/api/post/new_post', {post_title: ''})
                this.currentPost = result
                this.currentStatus = POST_WRITER_STATUS.auto_draft
            } catch (e) {
                this.$Message.info('创建新文章失败，请重新刷新页面')
            }
        }
        this.fetchTerms(false)
    },
    mounted () {
        console.log(this.$refs.md)
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
