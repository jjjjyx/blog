<template>
    <div class="">
        <div class="j-collapse ">
            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    <Icon type="flag"></Icon>
                    <span>状态:</span>
                    <template v-if="publishValue.status !== 'private'">
                    <b>{{ postStatusDict[postStatus] }}</b>
                    <a href="javascript:void(0);" @click.prevent="collapseStatus1 = !collapseStatus1">编辑</a>
                    </template>
                    <template v-else>
                        <b>私密、已发布</b>
                    </template>
                </div>
                <collapse-transition>
                <div class="j-collapse-body" v-show="collapseStatus1">
                    <Select size="small" style="width:100px" v-model="publishValue.postStatus">
                        <Option v-for="item in allowPostStatus" :value="item" :key="item">{{ postStatusDict[item] }}</Option>
                    </Select>
                    <Button size="small"  @click="savePostStatus(), collapseStatus1 = false">确定</Button>
                    <Button size="small" type="text" @click="resetPostStatus(), collapseStatus1 = false">取消</Button>
                </div>
                </collapse-transition>
            </div>

            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    <Icon type="eye"></Icon>
                    <span>公开度:</span>
                    <b v-text="publicText"></b>
                    <a href="javascript:void(0);" @click.prevent="collapseStatus2 = !collapseStatus2">编辑</a>
                </div>
                <collapse-transition>
                    <div class="j-collapse-body" v-show="collapseStatus2">
                        <radio-group v-model="publishValue.status" vertical @on-change="handleRadioChange">
                            <radio label="public">
                                <!--<Icon type="social-apple"></Icon>-->
                                <font-icon type="icon-gongkai"></font-icon>
                                <span>公开</span>
                            </radio>
                            <checkbox class="ml-4" v-model="publishValue.sticky" true-value="sticky" false-value="" :disabled="publishValue.status !== 'public'">置顶</checkbox>
                            <radio label="pass">
                                <!--<Icon type="social-android"></Icon>-->
                                <font-icon type="icon-simi"></font-icon>
                                <span>密码保护</span>
                            </radio>
                            <i-input v-model="publishValue.passValue" v-show="publishValue.status === 'pass'" ref="pass" class="ml-4" type="password"
                                     placeholder="密码" size="small" style="width: 150px"></i-input>
                            <radio label="private" :disabled="true">
                                <font-icon type="icon-simi1"></font-icon>
                                <span>仅自己可见</span>
                            </radio>
                        </radio-group>
                        <br>
                        <Button size="small"  @click="saveStatus(), collapseStatus2 = false">确定</Button>
                        <Button size="small" type="text" @click="resetStatus(), collapseStatus2 = false">取消</Button>
                    </div>
                </collapse-transition>
            </div>

            <div class="j-collapse-item" v-show="versionNum > 0">
                <div class="j-collapse-header">
                    <Icon type="ios-timer"></Icon>
                    <span>版本:</span>
                    <b>{{versionNum}}</b>
                    <a href="javascript:void(0);" @click="openVersionModel">查看</a>
                </div>
            </div>

            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    <Icon type="ios-calendar-outline"></Icon>
                    <!--保存的副本变量会使用当前时间，故这里取值必须取真实-->
                    <template v-if="publishDate">
                        <span>发布于:</span><span>{{dateFormat(publishValue.postDate, 'yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                    <template v-else>
                        <b>立即</b><span>发布:</span>
                    </template>
                    <a href="javascript:void(0);" @click.prevent="collapseStatus3 = !collapseStatus3">编辑</a>
                </div>
                <collapse-transition>
                    <div class="j-collapse-body" v-show="collapseStatus3">
                        <DatePicker type="date" ref="date"
                                    :clearable="false"
                                    :value="publishValue.postDate"
                                    class="mb-2" placeholder="发布时间" style="width: 110px"></DatePicker>@
                        <TimePicker type="time"  ref="time"
                                    :clearable="false"
                                    :value="publishValue.postDate"
                                    placeholder="发布时间" style="width: 90px"></TimePicker>
                        <br>
                        <Button size="small"  @click="savePostDate(), collapseStatus3 = false">确定</Button>
                        <Button size="small" type="text" @click="resetPostDate()">取消</Button>
                    </div>
                </collapse-transition>
            </div>
        </div>
        <div class="postbox-options clearfix">
            <!--通过判断发布时间是否存在 来判定是否有发布-->
            <Button size="small" type="text" style="color: #ed3f14" v-show="originPostStatus !== 'auto-draft'">移至回收站</Button>
            <Button size="small" class="float-right" type="primary" @click="release">{{isPublish ? '更新':'发布'}}</Button>
            <Button size="small" class="float-right mr-1" type="success">
                <a href="" style="color: inherit;">预览更改</a>
            </Button>
        </div>
    </div>
</template>

<script>

import merge from 'lodash/merge'
import {mapGetters, mapState} from 'vuex'
import CollapseTransition from '@/utils/collapse-transition'
import {dateFormat} from '@/utils/common'
import * as post from '../../../api/posts'

export default {
    components: {
        CollapseTransition
    },
    name: 'sidebar-publish',
    title: '发布',
    data: () => {
        return {
            // 如果是已发布的文章则多一个发布状态
            // allowPostStatus: ['pending', 'draft'],
            collapseStatus1: false,
            collapseStatus2: false,
            collapseStatus3: false,
            collapseStatus4: false,
            publishValue: {
                status: 'public',
                passValue: '',
                postStatus: '',
                sticky: '',
                postDate: null
            },
            originValue: {

            },
            originDate: null,
            originPostStatus: null // 用于记录原始的文章状态
        }
    },
    computed: {
        ...mapState({
            'postStatus': state => state.post.post_status,
            'publishDate': state => state.post.post_date,
            'versionNum': state => state.post.revision.length,
            'currentPost': state => state.post
        }),
        ...mapGetters({
            'postStatusDict': 'postStatusDict',
            'isPublish': 'isPublish'
        }),
        publicText () {
            switch (this.publishValue.status) {
            case 'public':
                // this.
                // 要获取到原始状态
                // this.postStatus = 'publish'
                return '公开'
            case 'pass':
                return '密码保护'
            case 'private':
                return '仅自己可见'
            }
        },
        allowPostStatus: function () {
            // 如果修改当前状态 为公开，可以预选 'pending', 'draft'
            // 如果修改当前状态 为公开，且当前状态就是发布状态可以预选 'publish', 'pending', 'draft'
            // 如果修改当前状态 为密码，跟文章状态不冲突
            // 如果修改当前状态 为私密，则不可以预选
            if (this.publishValue.status === 'private') {
                return []
            // } else if (this.postStatus === 'publish') {
            } else {
                return ['publish', 'pending', 'draft']
                // return ['pending', 'draft']
            }
        }
    },
    // props: ['currentPost'],
    watch: {
        'currentPost.id': '_changePost'
    },
    methods: {
        /**
         * 当前编辑的文章发生改变，重新填充当前发布的状态的值
         * @private
         */
        _changePost () {
            this.originDate = new Date()
            this.fillPublishValue()
            this.$store.dispatch('getOriginPost').then((originData) => {
                this.originPostStatus = originData.post_status
            })
        },
        // 回填状态信息
        fillPublishValue () {
            this.resetStatus()
            this.resetPostDate()
        },
        dateFormat,
        handleRadioChange () {
            if (this.publishValue.status === 'private') {
                this.collapseStatus1 = false
            }
        },
        savePostDate () {
            let data = this.$refs.date.visualValue
            let time = this.$refs.time.visualValue
            let _d = new Date(`${data} ${time}`)
            let _t1 = ~~(this.originDate / 1000)
            let _t2 = ~~(_d / 1000)
            if (_t1 === _t2) return
            // console.log(_d.getTime(), this.originDate.getTime(), this.originDate == +_d)
            this.publishValue.postDate = _d
            // this.postDate = _d
        },
        savePostStatus () {
            // this.$store.commit('updatePostStatus', this.tmpPostStatus)
        },
        saveStatus () {
            switch (this.publishValue.status) {
            case 'public':
                // this.
                // 要获取到原始状态
                // this.postStatus = 'publish'
                this.publishValue.postStatus = this.currentPost.post_status
                break
            case 'pass':
                // this.$store.commit('updatePostPass', this.tmpPass)
                break
            case 'private':
                // 禁用私有功能
                this.publishValue.postStatus = 'private'
                // this.$store.commit('updatePostStatus', 'private')
                break
            }
        },
        async resetPostStatus () {
            this.publishValue.postStatus = this.currentPost.post_status
        },
        async resetPostDate () {
            this.publishValue.postDate = this.currentPost.post_date || this.originDate
        },
        async resetStatus () {
            // 主要重置 状态， 密码 置顶
            this.resetPostStatus()
            this.publishValue.passValue = this.currentPost.post_password

            this.publishValue.sticky = this.currentPost.sticky
            console.log('this.publishValue.sticky === ', this.publishValue.sticky)
            if (this.currentPost.post_password) {
                this.publishValue.status = 'pass'
            } else if (this.currentPost.post_status === 'private') {
                this.publishValue.status = 'private'
            } else {
                this.publishValue.status = 'public'
            }
        },
        async release () {
            // 设置状态
            let mergeObj = {
                post_status: this.publishValue.postStatus,
                post_date: this.publishValue.postDate,
                sticky: this.publishValue.sticky,
                post_password: this.publishValue.passValue
            }

            // this.$store.commit('mergePost', mergeObj)
            let obj = this.$store.getters.ajaxPostClone

            if (!this.isPublish) { // 点击发布  // 如果当前状态没有修改过，并且点击了发布则修改文章状态为发布状态 否则发送修改的状态
                if (mergeObj.post_status === this.currentPost.post_status) {
                    mergeObj.post_status = this.publishValue.postStatus = 'publish'
                }
                // } else { // 点击更新
            }
            // 发起请求前不合并参数，这里只是临时合并，待发布成功后的回调后再更新文章信息
            merge(obj, mergeObj)
            // console.log('before obj', obj)
            try {
                // let revision = await api.npost('/api/post/release', obj)
                let revision = await post.release(obj)
                this.$Message.success({
                    render: h => {
                        let a = h('a', {
                            domProps: {
                                target: '_blank',
                                href: `/article/${obj.guid}`,
                                duration: 5000
                            }
                        }, '立即查看')
                        return ['更新文章成功', a]
                    }
                })
                // 成功发布后的回调
                this.$store.dispatch('afterRelease', {mergeObj, revision})
            } catch (e) {
                this.$Message.info('发布文章失败:', e.message)
            }
        },
        openVersionModel () {
            this.$emit('viewVersion')
        }
    },
    mounted () {
        this._changePost()
    }
}
</script>
