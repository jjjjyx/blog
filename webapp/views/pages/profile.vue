<template>
    <div class="pages-profile-container">
        <h1 class="h1">{{$t('router.profile')}}
            <small>查看 & 修改用户资料</small>
        </h1>

        <!-- 用户基础资料 头像等-->
        <div class="user-base-profile-row">
            <user-avatar-card></user-avatar-card>
            <user-base-info class="user-profile-warp"></user-base-info>
        </div>

        <row >
            <user-subscribe class="user-profile-warp ivu-col ivu-col-span-12"></user-subscribe>
            <user-pass-change class="user-profile-warp ivu-col ivu-col-span-12"></user-pass-change>
            <!-- 关于我 个人简介-->
            <!-- 密码修改 -->
        </row>
        <row >
            <user-login-history class="user-profile-warp ivu-col ivu-col-span-12"></user-login-history>
        </row>
    </div>
</template>

<script>
    // import cloneDeep from 'lodash/cloneDeep'
    import { mapState } from 'vuex'
    import InfoRow from './components/info-row'
    import UserAvatarCard from './components/user-avatar-card'
    import UserBaseInfo from './components/user-base-info'
    import UserPassChange from './components/user-pass-change'
    import UserLoginHistory from './components/user-login-history'
    import UserSubscribe from './components/user-subscribe'

    export default {
        name: 'profile',
        components: {UserSubscribe, UserLoginHistory, UserPassChange, UserBaseInfo, UserAvatarCard, InfoRow},
        data () {
            return {
                userBaseInfo: {}
            }
        },
        computed: {
            ...mapState({
                'user': state => state.user
            })
        }
    }
</script>
