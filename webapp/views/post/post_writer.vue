<template>
    <div class="post-writer-content curd-container">
        <div class="post-body-content" ref="postBody">
            <!--<Alert banner type="warning">Notice: notification contents...</Alert>-->
            <div class="post-title-wrap curd-toolbar">
                <input type="text" class="title" v-model="postTitle" placeholder="请输入一个标题">
                <div class="post-title-options curd-toolbar--right">
                    <tooltip content="新笔记">
                        <i-button type="text" icon="md-add" @click="newPost"></i-button>
                    </tooltip>
                    <tooltip content="标签">
                        <i-button type="text" icon="md-pricetags" @click="tagWrapShow = !tagWrapShow"></i-button>
                    </tooltip>
                    <tooltip content="附件">
                        <i-button type="text" class="ivu-btn-icon-only">
                            <i class="iconfont icon-fujian "></i>
                        </i-button>
                    </tooltip>
                    <tooltip content="笔记属性">
                        <i-button type="text" icon="ios-information-circle"></i-button>
                    </tooltip>
                    <tooltip content="关闭">
                        <i-button type="text" icon="md-close-circle"></i-button>
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
                        <Button icon="ios-add" type="dashed" class="mr-2" size="small"></Button>
                        <div class="post-tag-list" slot="content">
                            <CheckboxGroup v-model="selectedTag" @on-change="handleSelectTag">
                                <Checkbox :label="tag.name" v-for="(tag,index) in tagsList" :key="index">
                                    {{tag.name}}
                                </Checkbox>
                            </CheckboxGroup>
                        </div>
                    </Poptip>
                    <Tag v-for="(item, index) in selectedTag" :key="index" :name="item" closable
                         @on-close="$store.commit('splicePostTag',index)">{{item}}
                    </Tag>
                    <!--<Tag v-for="(item, index) in newTags" :key="item" :name="item" closable @on-close="$store.commit('splicePostNewTag',index)">{{item}}</Tag>-->
                    <input class="input-tag" autocomplete="off" tabindex="0" type="text" ref="tagInput"
                           v-model="newTagValue" placeholder="点击此处添加标签" @keyup.enter="addTag">
                </div>
            </collapse-transition>
            <div class="post-markdown-wrap">
                <mavon-editor style="height: 100%" :value="currentPost.post_content" ref="md"
                              :code-style="'atom-one-dark'"
                              @change="handleMdChange"
                              @save="handleMdSave"
                              @imgAdd="uploadImg" @imgDel="imgDel"></mavon-editor>
            </div>
            <div class="post-status-bar">
                <!--xx 创建 date    初始状态-->
                <!--xx 编辑于 date  修改后没保存-->
                <!--xx 保存于 date  保存后-->
                <!--xx 发布于 date  加载已发布-->
                <span>{{user.user_nickname}}</span>&nbsp;<span v-text="editorStatus"></span>
                <span
                    v-text="editorTime"></span>
            </div>
        </div>
        <div class="postbox-container" ref="postBox">
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
        <Modal v-model="saveTipModel" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>离开提示</span>
            </p>
            <div>
                是否保存当前文章？
            </div>
            <div slot="footer">
                <Button @click="resolve && resolve(), saveTipModel = false">保存</Button>
                <Button @click="reject && reject('no'), saveTipModel = false">不保存</Button>
                <Button @click="reject && reject('cancel'), saveTipModel = false">取消</Button>
            </div>
        </Modal>
        <version-modal ref="versionModal" :visible.sync="versionModel" @restore="showVersionWarning = false"></version-modal>
        <!--<Alert ref="alert" v-show="showVersionWarning" closable show-icon type="warning">有一个自动保存的版本比如下显示的版本还要新 <a href="javascript:;" @click="openVersionModel()">查看自动保存的版本</a></Alert>-->
    </div>

</template>

<script>

import debounce from 'lodash/debounce'
import isNumber from 'lodash/isNumber'
import toNumber from 'lodash/toNumber'

import draggable from 'vuedraggable'
import { mapActions, mapGetters, mapState } from 'vuex'
import store from '../../store'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import * as post from '../../api/posts'
import * as media from '../../api/media'
// import ajax from '@/utils/ajax'
import { on, off } from '@/utils/dom'
import { getMetaKeyCode, POST_WRITER_STATUS, dateFormat } from '@/utils/common'
import { validTermName } from '@/utils/validator'
import CollapseTransition from '@/utils/collapse-transition'

import sidebars from './sidebar/index'
import VersionModal from '../version/version'
import sidebarPanel from './sidebar/sidebar.vue'

const sidebarsOrder = Object.keys(sidebars)

const md = mavonEditor.getMarkdownIt()
md.set({ html: false })
export default {
    name: 'post-writer',
    data () {
        return {
            maxTagLength: 16,
            tagWrapShow: true,
            newTagValue: '',
            // currentStatus: POST_WRITER_STATUS.normal,
            sidebarsOrder,
            saveTipModel: false,
            versionModel: false,
            showVersionWarning: false
        }
    },
    components: {
        mavonEditor,
        draggable,
        CollapseTransition,
        sidebarPanel,
        VersionModal,
        ...sidebars
    },
    computed: {
        ...mapState({
            'user': 'user',
            'currentPost': state => state.post,
            'tagsList': state => state.data.tagList
        }),
        ...mapGetters(['showLeaveTip', 'autoSaveVersion', 'masterVersion']),
        editorStatus: {
            get () {
                return this.$store.state.post.status
            },
            set (value) {
                this.$store.commit('updateEditorStatus', value)
            }
        },
        editorTime: function () {
            // let s = th
            if (this.editorStatus === POST_WRITER_STATUS.created) {
                return dateFormat(this.currentPost.createdAt)
            } else if (this.editorStatus === POST_WRITER_STATUS.posted) {
                return dateFormat(this.currentPost.post_date)
            }
            return dateFormat(new Date())
        },
        versions: function () {
            return this.currentPost.revision
        },
        postTitle: {
            get () {
                return this.$store.state.post.post_title
            },
            set (value) {
                this.$store.commit('updatePostTitle', value)
            }
        },
        selectedTag: {
            get () {
                return this.$store.state.post.new_tag
            },
            set (value) {
                this.$store.commit('updateTags', value)
            }
        },
        currTagLength: function () {
            return this.selectedTag.length
        }
        // user: function () {
        //     return this.$
        // }
    },
    methods: {
        ...mapActions({
            'fetchData': 'fetchPostInfo',
            'createNewPost': 'createNewPost',
            openVersionModel: 'openVersionModel'
        }),
        checkTagLength () {
            return this.currTagLength < this.maxTagLength
        },
        // async fetchData() {
        //     // 加载数据
        // },
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
            } else if (!validTermName(this.newTagValue)) {
                this.$Message.info('请提交正确的标签名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！')
            } else if (this.selectedTag.indexOf(this.newTagValue) >= 0) { // 是否重复
                console.log('重复的标签')
            } else {
                this.$store.commit('pushPostTag', this.newTagValue)
            }
            this.newTagValue = ''
        },
        qiniuUpload: function (file) {
            return new Promise(async (resolve, reject) => {
                try {
                    // let md5 = await fileMd5(file)
                    // 3 = post/img/
                    // let tokenParam = {'x:space': 'post'} // 固定上传到文件空间

                    let token = await media.token()
                    // Q2xpcGJvYXJk = 'Clipboard'
                    file.isBase64 = true
                    this.$uploadFiles(file, {
                        space: 'post',
                        action: 'https://up-z2.qiniup.com/putb64/-1/x:space/cG9zdA==/x:remark/Q2xpcGJvYXJk', // post = 'cG9zdA=='  固定上传到文件空间
                        headers: {
                            'Authorization': `UpToken ${token}`,
                            'Content-Type': 'application/octet-stream'
                        },
                        onSuccess: ({ data, code }) => {
                            if (code === 0) {
                                let { url } = data
                                resolve(url)
                            }
                        },
                        onError: reject
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
        handleMdChange (value, render) {
            // console.log(value, value === this.currentPost.post_content)
            if (value && value !== this.currentPost.post_content) {
                // this.showLeaveTip =
                this.editorStatus = POST_WRITER_STATUS.edited
            } else {
                this.editorStatus = POST_WRITER_STATUS.created
            }
            this.$store.commit('updatePostContent', { value, render })
        },
        async handleMdSave () { // value, render
            // title 绑定了
            // 如果当前的通知没有被关闭 这个提示用户是否覆盖
            if (this.showVersionWarning) {
                await this.showSaveWarning()
                this.showVersionWarning = false
                // 点击了覆盖
            }
            this.$store.commit('updateEditorStatus', POST_WRITER_STATUS.saving)
            // this.postContent = value
            // this.renderValue = render
            let obj = this.$store.getters.ajaxPostClone
            try {
                let serverObj = await post.update(obj)
                this.pushRouter('replace')
                let mergeObj = {
                    guid: serverObj.guid,
                    post_date: serverObj.post_date
                }
                this.$store.commit('mergePost', mergeObj)
                this.$store.commit('updateEditorStatus', POST_WRITER_STATUS.saved)
                this.$store.commit('updateAutoSaveContent', obj)
                // 手动更新一下vuex 状态里的记录
            } catch (e) {
                this.$Message.info('保存失败')
                this.$store.commit('updateEditorStatus', POST_WRITER_STATUS.edited)
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
                this.resolve = () => {
                    let value = this.$refs.md.d_value
                    let render = this.$refs.md.d_render
                    this.handleMdSave(value, render)
                    resolve()
                }
                this.reject = reject
            })
        },
        showSaveWarning () {
            return new Promise((resolve, reject) => {
                this.$Modal.confirm({
                    title: 'Title',
                    content: '当前存在更新的版本记录，此次操作将会覆盖上次自动保存记录',
                    onOk: resolve,
                    onCancel: reject
                })
            })
        },
        handleKeyUp (e) {
            let keyCode = getMetaKeyCode(e)

            switch (keyCode) {
            case 4179: {
                e.preventDefault()
                e.stopPropagation()
                // 保存
                let target = e.target
                // 如果对象是编辑框则退出 这个事件已经被处理了
                if (target.nodeName === 'TEXTAREA') {
                    return
                }
                this.handleMdSave()
                break
            }
            }
        },
        checkVersion () {
            // 如果版本记录中 有最后修改时间大于当前修改时间的
            // let firstRevision = first(this.currentPost.revision)
            let autoSaveVersion = this.autoSaveVersion
            let masterVersion = this.masterVersion
            if (autoSaveVersion && masterVersion) {
                let autoSaveTime = autoSaveVersion.updatedAt.getTime()
                let masterTime = masterVersion.updatedAt.getTime()
                if (autoSaveTime > masterTime) {
                    this.showVersionWarning = true
                }
            }
            // if (!firstRevision) return null
            // let revisionFirstTime = new Date(first(this.currentPost.revision).updatedAt).getTime()
            // let currUpdatedAt = new Date(this.currentPost.updatedAt).getTime()
            // if (revisionFirstTime > currUpdatedAt) {
            //     this.showVersionWarning = true
            // }
        },
        // openVersionModel (ver) {
        //     // console.log('openVersionModel')
        //     this.versionModel = true
        //     if (ver) {
        //         this.$refs.versionModal.active = ver
        //     }
        // },
        async newPost (from = {}) {
            // 如果有尚未保存的文章 给出提示
            if (this.showLeaveTip) {
                try {
                    await this.leaveConfirm()
                } catch (e) {
                    if (e === 'cancel') {
                        let fromName = from.name
                        if (fromName) {
                            this.$router.push({ name: fromName })
                        }
                        return
                    }
                }
            }
            this.showVersionWarning = false
            await this.createNewPost()
            this.$router.push({ query: { poi: this.currentPost.id }, replace: true })
        },
        $$bindEvent () {
            on(document.body, 'keydown', this.handleKeyUp)
        },
        $$offEvent () {
            off(document.body, 'keydown', this.handleKeyUp)
        }
    },
    watch: {
        editorStatus: function () {
            if (this.showLeaveTip) {
                window.onbeforeunload = function () {
                    return '确认离开页面，当前修改将会丢弃'
                }
            } else {
                window.onbeforeunload = null
            }
        },
        showVersionWarning (val) {
            if (val) {
                this.$Notice.warning({
                    title: '提示',
                    name: 'version_notice',
                    duration: 0,
                    render: (h) => {
                        let a = h('a', {
                            domProps: { href: 'javascript:;' },
                            on: {
                                click: () => {
                                    this.openVersionModel()
                                    this.$Notice.close('version_notice')
                                }
                            }
                        }, '查看自动保存的版本')
                        return ['有一个自动保存的版本比如下显示的主版本还更新', a]
                    }
                })
            } else {
                this.$Notice.close('version_notice')
            }
        }
    },
    async beforeRouteEnter (to, from, next) {
        await store.dispatch('fetchTerms', false)
        let { poi, active } = to.query
        poi = toNumber(poi)
        let newFn = async () => {
            try {
                let post = await store.dispatch('createNewPost')
                return next({ replace: true, query: { poi: post.id }, name: 'post_writer' })
            } catch (e) {
                return next({ name: 'post_management' })
            }
        }
        if (active === 'new') {
            return newFn()
        }

        let currentPost = store.state.post
        poi = poi || currentPost.id
        if (!(poi && isNumber(poi))) { // 提交的post 不存在，或者poi 不合法，创建文章 不存在文章
            return newFn()
        }
        if (poi === currentPost.id) { // 跟缓存一致
            return next(vm => {
                vm.$$bindEvent()
            })
        } else { // 获取post
            try {
                await store.dispatch('fetchPostInfo', poi)
                next(vm => {
                    vm.checkVersion()
                    vm.$$bindEvent()
                })
            } catch (e) {
                next({ name: 'post_management' })
            }
        }
    },
    async beforeRouteLeave (to, from, next) {
        if (this.showLeaveTip) {
            try {
                await this.leaveConfirm()
            } catch (e) {
                if (e === 'cancel') {
                    // 点击取消
                    return next(false)
                }
            }
        }
        this.$$offEvent()
        this.showVersionWarning = false
        next()
    },
    mounted () {
        let onResize = debounce(() => {
            // 这里地方 不知道什么缘故需要设置一下容易的宽度，好像flex 布局有什么坑
            let width = this.$el.clientWidth - this.$refs['postBox'].clientWidth
            this.$refs['postBody'].style.width = `${width}px`
        }, 1000)
        onResize()
        on(window, 'resize', onResize)
    }
}
</script>
