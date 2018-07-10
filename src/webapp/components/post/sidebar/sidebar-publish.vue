<template>
    <div class="">
        <div class="j-collapse ">
            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    <Icon type="flag"></Icon>
                    <span>状态:</span>
                    <b>{{ postStatusDict[postStatus] }}</b>
                    <a href="javascript:void(0);" @click.prevent="collapseStatus1 = !collapseStatus1">编辑</a>
                </div>
                <collapse-transition>
                <div class="j-collapse-body" v-show="collapseStatus1">
                    <Select size="small" style="width:100px">
                        <Option v-for="item in allowPostStatus" :value="item" :key="item">{{ postStatusDict[item] }}</Option>
                    </Select>
                    <Button size="small" type="ghost" @click="savePostStatus">确定</Button>
                    <Button size="small" type="text">取消</Button>
                </div>
                </collapse-transition>
            </div>

            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    <Icon type="eye"></Icon>
                    <span>公开度:</span>
                    <b>已发布</b>
                    <a href="javascript:void(0);" @click.prevent="collapseStatus2 = !collapseStatus2">编辑</a>
                </div>
                <collapse-transition>
                    <div class="j-collapse-body" v-show="collapseStatus2">
                        <radio-group v-model="tmpStatus" vertical>
                            <radio label="public">
                                <!--<Icon type="social-apple"></Icon>-->
                                <i class="iconfont icon-gongkai"></i>
                                <span>公开</span>
                            </radio>
                            <checkbox class="ml-4" v-model="sticky" true-value="sticky" false-value="''" :disabled="tmpStatus !='public'">置顶</checkbox>
                            <radio label="pass">
                                <!--<Icon type="social-android"></Icon>-->
                                <i class="iconfont icon-simi"></i>
                                <span>密码保护</span>
                            </radio>
                            <i-input v-model="postPass" v-show="tmpStatus ==='pass'" class="ml-4" type="password" placeholder="密码" size="small"></i-input>
                            <radio label="private">
                                <i class="iconfont icon-simi1"></i>
                                <span>仅自己可见</span>
                            </radio>
                        </radio-group>
                        <br>
                        <Button size="small" type="ghost" @click="save">确定</Button>
                        <Button size="small" type="text" @click="reset">取消</Button>
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
        <div class="postbox-options">
            <Button size="small" type="text" style="color: #ed3f14">移至回收站</Button>
            <Button size="small" class="float-right" type="primary">发布</Button>
            <Button size="small" class="float-right mr-1" type="success">
                <a href="" style="color: inherit;">预览更改</a>
            </Button>
        </div>
    </div>
</template>

<script>

import {mapGetters, mapState} from 'vuex'
import CollapseTransition from '@/utils/collapse-transition'
import {dateFormat} from '../../../utils/common'

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
            tmpStatus: '',
            sticky: '',
            passValue: '',
            originDate: null
            // postDate: new Date()
        }
    },
    computed: {
        // ...mapState({
        //     'postStatus': state => state.post_writer.post_status
        // }),
        ...mapState({
            'publishDate': state => state.post_writer.post_date,
            'versionNum': state => state.post_writer.revision.length,
            'currentPost': state => state.post_writer,
        }),
        ...mapGetters({
            'postStatusDict': 'postStatusDict'
        }),
        allowPostStatus: function () {
            if (this.postStatus === 'publish') {
                return ['publish', 'pending', 'draft']
            } else {
                return ['pending', 'draft']
            }
        },
        postPass: {
            get () { return this.$store.state.post_writer.post_password },
            set (value) { this.$store.commit('updatePostPass', value) }
        },
        // sticky: {
        //     get () { return this.$store.state.post_writer.sticky },
        //     set (value) { this.$store.commit('updateSticky', value) }
        // },
        postStatus: {
            get () { return this.$store.state.post_writer.post_status },
            set (value) { this.$store.commit('updateSticky', value) }
        },
        postDate: {
            get () { return this.$store.state.post_writer.post_date || this.originDate },
            set (value) {this.$store.commit('updatePostDate', value)}
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
        },
        postDate: function (val) {
            // 在页面中修改了时间
        }
    },
    methods: {
        dateFormat,
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
                break
            case 'pass':
                break
            case 'private':
                break
            }
        },
        reset () {}
    }
}
</script>
