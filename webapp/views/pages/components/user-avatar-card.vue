<template>
    <div class="card-user-avatar-warp card">
        <div class="image card-header">
            <img src="https://image.cdn.mbdoge.cn/FnHqrCMNHlUprEQ_b-Z0TJuo394i" alt="">
            <!-- 设置背景图片 -->
            <!--<div class="toobar">-->
            <!---->
            <!--</div>-->

        </div>
        <div class="card-extra">
            <!-- todo 图片选择组件-->
            <Tooltip content="设置这个背景" class="image-setting-btn">
                <Icon type="md-settings"/>
            </Tooltip>
        </div>
        <div class="card-body">
            <div class="user-avatar">
                <img :src="user.user_avatar" alt="">
            </div>
            <h2 class="mt-4 mb-3">{{user.user_nickname}}
                <Tag color="success">online</Tag>
            </h2>
            <!-- todo user field -->
            <h4>前端 / 懂点架构的前端</h4>
        </div>
        <!-- 允许自定义 这个列表-->
        <!--<ul class="social-ul list-inline mt-4">-->
        <!--<li>-->
        <!--<a class="social-ul__a" href="http://wpa.qq.com/msgrd?v=3&uin=871839012&site=qq&menu=yes" target="_blank">-->
        <!--<color-icon type="icon-color-QQ1" :size="22"></color-icon>-->
        <!--</a>-->
        <!--</li>-->
        <!--<li>-->
        <!--<a class="social-ul__a" href="https://github.com/jjjjyx" target="_blank">-->
        <!--<color-icon type="icon-color-GitHub" :size="22"></color-icon>-->
        <!--</a>-->
        <!--</li>-->
        <!--<li>-->
        <!--<a class="social-ul__a" href="http://weibo.com/5403878645" target="_blank">-->
        <!--<color-icon type="icon-color-weibo" :size="22"></color-icon>-->
        <!--</a>-->
        <!--</li>-->
        <!--<li>-->
        <!--<Poptip placement="bottom" trigger="hover" >-->
        <!--<a class="social-ul__a" href="javascript:;">-->
        <!--<color-icon type="icon-color-weixin" :size="22"></color-icon>-->
        <!--</a>-->
        <!--<div slot="content">-->
        <!--<img src="https://image.cdn.mbdoge.cn/64807460-27ea-11e7-a8e7-a53b0973c884.png?imageView2/2/w/150/format/jpg" alt="">-->
        <!--</div>-->
        <!--</Poptip>-->
        <!--</li>-->
        <!--<li>-->
        <!--<a class="social-ul__a" href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=jyx@rpgame.net"-->
        <!--target="_blank"><color-icon type="icon-color-youxiang" :size="22"></color-icon></a>-->
        <!--</li>-->
        <!--</ul>-->
        <!--  文章数 | 图片数 | 标签 -->
        <ul class="extra-ul list-inline mt-4">
            <li>
                <span>{{statistics.publishPostNum}}</span>
                <label>文章数</label>
            </li>
            <li>
                <span>{{statistics.mediaNum}}</span>
                <label>图片数</label>
            </li>
            <li>
                <span>{{statistics.tagNum}}</span>
                <label>标签</label>
            </li>
        </ul>
        <div class="card-footer">

            <div class=""></div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'user-avatar-card',
    computed: {
        ...mapState({
            'user': state => state.user,
            'statistics': state => state.data.statistics
        })
    }
}
</script>
