<template>
    <div class="">
        <div class="j-collapse ">
            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    <Icon type="flag"></Icon>
                    <span>状态:</span>
                    <b>已发布</b>
                    <a href="javascript:void(0);" @click.prevent="collapseStatus1 = !collapseStatus1">编辑</a>
                </div>
                <collapse-transition>
                <div class="j-collapse-body" v-show="collapseStatus1">
                    <Select size="small" style="width:100px">
                        <Option v-for="item in allowPostStatus" :value="item" :key="item">{{ postStatusDict[item] }}</Option>
                    </Select>
                    <Button size="small" type="ghost">确定</Button>
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
                                <Icon type="social-apple"></Icon>
                                <span>公开</span>
                            </radio>
                            <checkbox class="ml-4" v-model="sticky" true-value="sticky" false-value="''" :disabled="tmpStatus !='public'">置顶</checkbox>
                            <radio label="pass">
                                <Icon type="social-android"></Icon>
                                <span>密码保护</span>
                            </radio>
                            <i-input v-model="postPass" v-show="tmpStatus ==='pass'" class="ml-4" type="password" placeholder="密码" size="small"></i-input>
                            <radio label="private">
                                <Icon type="social-windows"></Icon>
                                <span>私密</span>
                            </radio>
                        </radio-group>
                        <br>
                        <Button size="small" type="ghost" @click="save">确定</Button>
                        <Button size="small" type="text" @click="reset">取消</Button>
                    </div>
                </collapse-transition>
            </div>

            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    <Icon type="ios-timer"></Icon>
                    <span>版本:</span>
                    <b>6</b>
                    <a href="javascript:void(0);">查看</a>
                </div>
            </div>

            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    <Icon type="ios-calendar-outline"></Icon>
                    <span>发布于:</span>
                    <span>2018年6月23日 23:46</span>
                    <a href="javascript:void(0);" @click.prevent="collapseStatus3 = !collapseStatus3">编辑</a>
                </div>
                <collapse-transition>
                    <div class="j-collapse-body" v-show="collapseStatus3">
                        <DatePicker size="small" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="Select date and time(Excluding seconds)" style="width: 100%"></DatePicker>
                    </div>
                </collapse-transition>
            </div>
        </div>
        <div class="postbox-options">
            <Button size="small" type="text" style="color: #ed3f14">移至回收站</Button>
            <Button size="small" class="float-right " type="primary">发布</Button>
            <Button size="small" class="float-right mr-1" type="success">
                <a href="" style="color: inherit;">预览更改</a>
            </Button>
        </div>
    </div>
</template>

<script>

import {mapGetters} from 'vuex'
import CollapseTransition from '@/utils/collapse-transition'
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
            passValue: ''
        }
    },
    computed:{
        // ...mapState({
        //     'postStatus': state => state.post_writer.post_status
        // }),
        ...mapGetters(['postStatusDict']),
        allowPostStatus: function (){
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
        }
    },
    props: ['currentPost'],
    methods: {
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
        reset () {},
    }
}
</script>
