<template>
    <div class="">
        <div class="j-collapse ">
            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    <Icon type="flag"></Icon>
                    <span>状态:</span>
                    <template v-if="tmpStatus != 'private'">
                    <b>{{ postStatusDict[postStatus] }}</b>
                    <a href="javascript:void(0);" @click.prevent="collapseStatus1 = !collapseStatus1">编辑</a>
                    </template>
                    <template v-else>
                        <b>私密、已发布</b>
                    </template>
                </div>
                <collapse-transition>
                <div class="j-collapse-body" v-show="collapseStatus1">
                    <Select size="small" style="width:100px" v-model="tmpPostStatus">
                        <Option v-for="item in allowPostStatus" :value="item" :key="item">{{ postStatusDict[item] }}</Option>
                    </Select>
                    <Button size="small" type="ghost" @click="savePostStatus(), collapseStatus1 = false">确定</Button>
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
                        <radio-group v-model="tmpStatus" vertical @on-change="handleRadioChange">
                            <radio label="public">
                                <!--<Icon type="social-apple"></Icon>-->
                                <i class="iconfont icon-gongkai"></i>
                                <span>公开</span>
                            </radio>
                            <checkbox class="ml-4" v-model="sticky" true-value="sticky" false-value="" :disabled="tmpStatus !='public'">置顶</checkbox>
                            <radio label="pass">
                                <!--<Icon type="social-android"></Icon>-->
                                <i class="iconfont icon-simi"></i>
                                <span>密码保护</span>
                            </radio>
                            <i-input v-model="tmpPass" v-show="tmpStatus ==='pass'" ref="pass" class="ml-4" type="password"
                                     placeholder="密码" size="small" style="width: 150px"></i-input>
                            <radio label="private">
                                <i class="iconfont icon-simi1"></i>
                                <span>仅自己可见</span>
                            </radio>
                        </radio-group>
                        <br>
                        <Button size="small" type="ghost" @click="save(), collapseStatus2 = false">确定</Button>
                        <Button size="small" type="text" @click="reset(), collapseStatus2 = false">取消</Button>
                    </div>
                </collapse-transition>
            </div>

            <div class="j-collapse-item" v-show="versionNum > 0">
                <div class="j-collapse-header">
                    <Icon type="ios-timer"></Icon>
                    <span>版本:</span>
                    <b>{{versionNum}}</b>
                    <a href="javascript:void(0);">查看</a>
                </div>
            </div>

            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    <Icon type="ios-calendar-outline"></Icon>
                    <template v-if="publishDate">
                        <span>发布于:</span>
                        <span>{{dateFormat(publishDate, 'yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                    <template v-else>
                        <b>立即</b>
                        <span>发布:</span>
                    </template>
                    <a href="javascript:void(0);" @click.prevent="collapseStatus3 = !collapseStatus3">编辑</a>
                </div>
                <collapse-transition>
                    <div class="j-collapse-body" v-show="collapseStatus3">
                        <DatePicker type="date" ref="date"
                                    :clearable="false"
                                    :value="postDate"
                                    class="mb-2" placeholder="发布时间" style="width: 110px"></DatePicker>@
                        <TimePicker type="time"  ref="time"
                                    :clearable="false"
                                    :value="postDate"
                                    placeholder="发布时间" style="width: 90px"></TimePicker>
                        <br>
                        <Button size="small" type="ghost" @click="savePostDate(), collapseStatus3 = false">确定</Button>
                        <Button size="small" type="text" @click="resetPostDate()">取消</Button>
                    </div>
                </collapse-transition>
            </div>
        </div>
        <div class="postbox-options clearfix">
            <Button size="small" type="text" style="color: #ed3f14" v-show="originPostStatus != 'auto-draft'">移至回收站</Button>
            <Button size="small" class="float-right" type="primary" @click="release">{{isPublish ? '更新':'发布'}}</Button>
            <Button size="small" class="float-right mr-1" type="success">
                <a href="" style="color: inherit;">预览更改</a>
            </Button>
        </div>
    </div>
</template>

<script>

// import _ from 'lodash'
import {mapGetters, mapState} from 'vuex'
import CollapseTransition from '@/utils/collapse-transition'
import api from '@/utils/api'
import {dateFormat} from '@/utils/common'

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
            tmpStatus: 'public',
            tmpPass: '',
            tmpPostStatus: '',
            sticky: '',
            passValue: '',
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
            switch (this.tmpStatus) {
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
            if (this.tmpStatus === 'private') {
                return []
            } else if (this.postStatus === 'publish') {
                return ['publish', 'pending', 'draft']
            } else {
                return ['pending', 'draft']
            }
        },
        postDate: {
            get () { return this.$store.state.post.post_date || this.originDate },
            set (value) { this.$store.commit('updatePostDate', value) }
        }
    },
    // props: ['currentPost'],
    watch: {
        'currentPost.id': function (val) {
            // 有变化的时候 说明更换了文章， 此时读取文章的状态 进行设置
            // 获取到文章的发布时间
            // let post_date = this.currentPost.post_date
            // if (post_date) {
            //     this.postDate = post_date
            // }
            this.originDate = new Date()
            this.fillTmp()
            this.$store.dispatch('getOriginPost').then((originDate) => {
                this.originPostStatus = originDate.post_status
            })

            // this.
        }
    },
    methods: {
        // 回填状态信息
        fillTmp () {
            this.tmpPass = this.currentPost.post_password
            this.tmpPostStatus = this.currentPost.post_status
            this.sticky = this.currentPost.sticky
            if (this.currentPost.post_password) {
                this.tmpStatus = 'pass'
            } else if (this.currentPost.post_status === 'private') {
                this.tmpStatus = 'private'
            } else {
                this.tmpStatus = 'public'
            }
        },
        dateFormat,
        handleRadioChange () {
            if (this.tmpStatus === 'private') {
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
            this.postDate = _d
        },
        savePostStatus () {
            this.$store.commit('updatePostStatus', this.tmpPostStatus)
        },
        async resetPostStatus () {
            let originDate = await this.$store.dispatch('getOriginPost')
            this.$store.commit('updatePostStatus', originDate.post_status)
        },
        async resetPostDate () {
            let originDate = await this.$store.dispatch('getOriginPost')
            this.postDate = originDate.post_date
            // this.postDate =
        },
        save () {
            switch (this.tmpStatus) {
            case 'public':
                // this.
                // 要获取到原始状态
                // this.postStatus = 'publish'
                this.$store.dispatch('getOriginPost').then((originDate) => {
                    this.$store.commit('updatePostStatus', this.tmpPostStatus || originDate.post_status)
                })
                this.$store.commit('updateSticky', this.sticky)
                break
            case 'pass':
                this.$store.commit('updatePostPass', this.tmpPass)
                break
            case 'private':
                this.$store.commit('updatePostStatus', 'private')
                break
            }
        },
        async reset () {
            // 主要重置 状态， 密码 置顶
            let originDate = await this.$store.dispatch('getOriginPost')
            this.$store.commit('updatePostPass', originDate.post_password)
            this.$store.commit('updatePostStatus', this.tmpPostStatus || originDate.post_status)
            this.$store.commit('updateSticky', originDate.sticky)

            // this.tmpPass = this.currentPost.post_password
            // this.tmpPostStatus = this.currentPost.post_status
            // this.sticky = this.currentPost.sticky
            this.fillTmp()
        },
        async release () {
            let obj = this.$store.getters.ajaxPostClone
            try {
                await api.npost('/api/post/release', obj)
                this.$Message.success({
                    render: h => {
                        let a = h('a', {
                            domProps: {
                                target: '_blank',
                                href: '/' // todo 跳转到文章
                            }
                        }, '立即查看')
                        return h('span', ['更新文章成功', a,])
                    }
                })
            } catch (e) {

            }

        }

    }
}
</script>
