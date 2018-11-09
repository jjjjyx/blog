<template>
    <div class="pages-profile-container">
        <h1 class="h1">{{$t('router.profile')}}
            <small>查看 & 修改用户资料</small>
        </h1>

        <!-- 用户基础资料 头像等-->
        <div class="user-base-profile-row">
            <div class="card-user-avatar-warp card">
                <div class="image card-header">
                    <img src="http://image.cdn.mbdoge.cn/FnHqrCMNHlUprEQ_b-Z0TJuo394i" alt="">
                    <!-- 设置背景图片 -->
                    <!--<div class="toobar">-->
                        <!---->
                    <!--</div>-->

                </div>
                <div class="card-extra">
                    <!-- todo 图片选择组件-->
                    <Tooltip content="设置这个背景" class="image-setting-btn">
                        <Icon type="md-settings" />
                    </Tooltip >
                </div>
                <div class="card-body">
                    <div class="user-avatar">
                        <img :src="user.user_avatar" alt="">
                    </div>
                    <h2 class="mt-3">{{user.user_nickname}}</h2>
                    <!-- todo user field -->
                    <h4>前端 / 懂点架构的前端</h4>
                </div>
                <div class="card-footer">
                    <!--33-->
                </div>
            </div>
            <div class="user-base-profile-warp">
                <h2>用户基本资料</h2>
                <hr>
                <table>
                    <tr>
                        <td>username</td>
                        <td>酱酱酱酱油鲜</td>
                    </tr>
                </table>
            </div>
        </div>

    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        name: 'profile',
        computed: {
            ...mapState({
                'user': state => state.user
            })
        }
    }
</script>
