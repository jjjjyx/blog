<template>
    <div>
        <div class="j-version-item" v-for="(version, index) in versions" v-bind:key="index">
            <avatar :style="{background: color}" size="small">{{version.user.user_login}}</avatar>
            <span class="j-version-username">{{version.user.user_login}}</span> &nbsp;
            <span>{{getTimeText(new Date(version.updatedAt).getTime())}}</span>
            <a href="javascript:;" @click="$emit('viewVersion', version)">({{dateFormat(version.updatedAt, 'M/d hh:mm:ss')}})</a>
            <Tooltip content="自动保存" v-if="version.autosave">
                <span  style="cursor: pointer;color:#ffbf00 ">[ auto ]</span>
                <!--<Icon type="flag" color="#2d8cf0"></Icon>-->
            </Tooltip>
            <Tooltip content="当前版本" v-if="version.curr">
                <span  style="cursor: pointer;color:#2d8cf0;">[ master ]</span>
                <!--<Icon type="flag" color="#ffbf00"></Icon>-->
            </Tooltip>
        </div>
    </div>
</template>

<script>
// const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
import {getTimeText, dateFormat} from '../../../utils/common'
import _ from 'lodash'
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']

export default {
    name: 'sidebar-version',
    title: '文章版本',
    props: {
        currentPost: {
            type: Object,
            required: true
        }
    },
    computed: {
        versions: function () {
            return _.orderBy(this.currentPost.revision, ['updatedAt'], ['desc'])
        }
    },
    methods: {
        getTimeText,
        dateFormat
    },
    data () {
        return {
            color: ColorList[0]
        }
    }
}
</script>

<style>
    .j-version-item {
        margin-bottom: 12px;
        font-size: 12px;
    }
    .j-version-username {
        cursor: default;
    }
</style>
