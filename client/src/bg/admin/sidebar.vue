

<template>

<!-- 侧边导航栏 -->
<div class="left-sidebar" >
    <!-- 用户信息 -->
    <div class="tpl-sidebar-user-panel">
        <div class="tpl-user-panel-slide-toggleable">
            <div class="tpl-user-panel-profile-picture">
                <img src="http://oht47c0d0.bkt.clouddn.com/17-1-11/75763093-file_1484140871299_166f3.png" alt="">
            </div>
            <span class="user-panel-logged-in-text">
          <i class="am-icon-circle-o am-text-success tpl-user-panel-status-icon"></i>
          {{user&&user.user_nickname}}
      </span>
            <a href="javascript:;" class="tpl-user-panel-action-link"> <span class="am-icon-pencil"></span> 账号设置</a>
        </div>
    </div>

    <!-- 菜单 -->
    <ul class="sidebar-nav">
        <li class="sidebar-nav-heading">Dashboard <span class="sidebar-nav-heading-info"> 仪表盘</span></li>
        <li class="sidebar-nav-link">
            <router-link to="/" active-class='active' exact>
                <span class="am-icon-home sidebar-nav-link-logo"></span> 首页
            </router-link>
        </li>
        <li class="sidebar-nav-link">
            <!-- <a href="javascript:;">
                    <i class="am-icon-table sidebar-nav-link-logo"></i>
                </a> -->
            <a href="javascript:;" class="sidebar-nav-sub-title">
                <i class="am-icon-book sidebar-nav-link-logo"></i> 文章管理
                <span class="am-icon-chevron-down am-fr am-margin-right-sm sidebar-nav-sub-ico"></span>
            </a>
            <ul class="sidebar-nav sidebar-nav-sub">
                <li class="sidebar-nav-link">
                    <a href="javascript:;">
                        <span class="am-icon-angle-right sidebar-nav-link-logo"></span> 所有文章
                    </a>
                </li>
                <li class="sidebar-nav-link">
                    <router-link to="/tag" active-class='active'>
                        <span class="am-icon-angle-right sidebar-nav-link-logo"></span> 撰写文章
                    </router-link>
                </li>
                <li class="sidebar-nav-link">
                    <a href="javascript:;">
                        <span class="am-icon-angle-right sidebar-nav-link-logo"></span> 分类管理
                    </a>
                </li>
                <li class="sidebar-nav-link">
                    <a href="javascript:;">
                        <span class="am-icon-angle-right sidebar-nav-link-logo"></span> 标签管理
                    </a>
                </li>
                <li class="sidebar-nav-link">
                    <router-link to="/trash" active-class='active'>
                        <span class="am-icon-angle-right sidebar-nav-link-logo"></span> 回收站
                    </router-link>
                </li>
            </ul>
        </li>
        <li class="sidebar-nav-link">
            <a href="javascript:;">
                <i class="am-icon-upload sidebar-nav-link-logo"></i> 上传管理
            </a>
        </li>
        <li class="sidebar-nav-link">
            <a href="javascript:;">
                <i class="am-icon-wpforms sidebar-nav-link-logo"></i> 留言
            </a>
        </li>
        <li class="sidebar-nav-heading">other<span class="sidebar-nav-heading-info"> 其他</span></li>

        <li class="sidebar-nav-link">
            <a href="javascript:;">
                <i class="am-icon-user sidebar-nav-link-logo"></i> 用户管理
                <!-- <span class="am-badge am-badge-secondary sidebar-nav-link-logo-ico am-round am-fr am-margin-right-sm">6</span> -->
            </a>
        </li>
        <li class="sidebar-nav-link">
            <a href="javascript:;">
                <i class="am-icon-cog sidebar-nav-link-logo"></i> 设置
            </a>
        </li>
        <li class="sidebar-nav-link">
            <a href="javascript:;">
                <i class="am-icon-tv sidebar-nav-link-logo"></i> 其他
            </a>
        </li>

    </ul>
</div>

</template>

<script>

import {mapGetters,mapMutations} from 'vuex';
export default {
    data: function() {
        return {
            activeSidebar: false,
        }
    },
    components: {},
    computed: {
        ...mapGetters([
            'user',
            'isSidebarShow',
            'autoHeight',
            // 'headerBarHeight'
        ])
    },
    methods: {
        ...mapMutations([
            'toggleSidebar'
        ])
    },
    mounted: function() {
        // console.log("sidebar");
        $('.sidebar-nav-sub-title').on('click', function() {
            $(this).toggleClass("active").siblings('.sidebar-nav-sub').slideToggle(80)
                .end()
                .find('.sidebar-nav-sub-ico').toggleClass('sidebar-nav-sub-ico-rotate');
        })
        $(window).resize(()=> {
            if($(window).width() < 1024){
                this.toggleSidebar(true);
            }

        });

    }
}

</script>
