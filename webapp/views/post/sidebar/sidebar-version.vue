<template>
    <div>
        <div class="j-version-item" v-for="(version, index) in versions" v-bind:key="index">
            <Avatar :style="{background: color}" size="small" class="mr-2">{{nickname(version.user.user_nickname)}}</Avatar>
            <span class="j-version-username mr-2">{{version.user.user_login}}</span>
            <Tooltip :content="dateFormat(version.updatedAt, 'MM/dd hh:mm:ss')">
                <a @click="handleOpenVersionPanel(version)">
                    <span class="mr-1">#{{version.id}}</span>
                    <font-icon type="md-timer" size="16"></font-icon>
                    {{getTimeText(new Date(version.updatedAt).getTime())}}
                </a>
            </Tooltip>
            <Tooltip content="自动保存" v-if="version.autosave">
                <span style="cursor: pointer;color:#ffbf00 ">[ auto ]</span>
                <!--<Icon type="flag" color="#2d8cf0"></Icon>-->
            </Tooltip>
            <Tooltip content="当前版本" v-if="version.master">
                <span style="cursor: pointer;color:#2d8cf0;">[ master ]</span>
                <!--<Icon type="flag" color="#ffbf00"></Icon>-->
            </Tooltip>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getTimeText, dateFormat } from '../../../utils/common'
import sidebarMixins from './sidebar-mixins'
// import orderBy from 'lodash/orderBy'

const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']
export default {
    name: 'sidebar-version',
    mixins: [sidebarMixins],
    title: '文章版本',
    methods: {
        ...mapActions({
            openVersionModel: 'openVersionModel'
        }),
        getTimeText,
        dateFormat,
        nickname (nickname) {
            if (nickname.length > 3) {
                return nickname[0]
            } else {
                return nickname
            }
        },
        handleOpenVersionPanel (ver) {
            this.openVersionModel(ver)
            // this.$emit('viewVersion', version)
        }
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
