                    <!-- <div class="container-fluid am-cf">
                        <div class="row">
                            <div class="am-u-sm-12 am-u-md-12 am-u-lg-9">
                                <div class="page-header-heading"><span class="am-icon-home page-header-heading-icon"></span> 首页 /<small>首页</small></div>
                                <p class="page-header-description">也没什么说的</p>
                            </div>
                            <div class="am-u-lg-3 tpl-index-settings-button">
                                <button type="button" class="page-header-button"><span class="am-icon-paint-brush"></span> 设置</button>
                            </div>
                        </div>

                    </div> -->
<template>
    <div class="am-g tpl-g " :class="skiner">
        <!-- 头部 -->
        <header>
            <!-- logo -->
            <div class="am-fl tpl-header-logo">
                <router-link to="/" active-class='active' exact>
                    <img src="http://oht47c0d0.bkt.clouddn.com/797d3a20-0016-11e7-8ec4-c526ba0271a0.png" alt="首页" title="返回首页">
                </router-link>
            </div>
            <!-- 右侧内容 -->
            <div class="tpl-header-fluid">
                <!-- 侧边切换 -->
                <div class="am-fl tpl-header-switch-button" @click="toggleSidebar(!isSidebarShow)">
                    <i class="am-icon-list"></i>
                    <i class="am-icon-reply"></i>
                </div>
                <!-- 搜索 -->
                <div class="am-fl tpl-header-search">
                    <form class="tpl-header-search-form" action="javascript:;">
                        <button class="tpl-header-search-btn am-icon-search"></button>
                        <input class="tpl-header-search-box" type="text" placeholder="搜索内容...">
                    </form>
                </div>
                <!-- 其它功能-->
                <div class="am-fr tpl-header-navbar">
                    <ul>
                        <!-- 欢迎语 -->
                        <li class="am-text-sm tpl-header-navbar-welcome">
                            <a href="javascript:;">欢迎您, <span>{{user&&user.display_name}}</span> </a>
                        </li>

                        <!-- 新邮件 -->
                        <li class="am-dropdown tpl-dropdown" data-am-dropdown>
                            <a href="javascript:;" class="am-dropdown-toggle tpl-dropdown-toggle" data-am-dropdown-toggle>
                                <i class="am-icon-envelope"></i>
                                <span class="am-badge am-badge-success am-round item-feed-badge">4</span>
                            </a>
                            <!-- 弹出列表 -->
                            <ul class="am-dropdown-content tpl-dropdown-content">
                                <li class="tpl-dropdown-menu-messages">
                                    <a href="javascript:;" class="tpl-dropdown-menu-messages-item am-cf">
                                        <div class="menu-messages-ico">
                                            <img src="http://oht47c0d0.bkt.clouddn.com/17-1-11/75763093-file_1484140871299_166f3.png" alt="">
                                        </div>
                                        <div class="menu-messages-time">
                                            3小时前
                                        </div>
                                        <div class="menu-messages-content">
                                            <div class="menu-messages-content-title">
                                                <i class="am-icon-circle-o am-text-success"></i>
                                                <span>夕风色</span>
                                            </div>
                                            <div class="am-text-truncate"> Amaze UI 的诞生，依托于 GitHub 及其他技术社区上一些优秀的资源；Amaze UI 的成长，则离不开用户的支持。 </div>
                                            <div class="menu-messages-content-time">2016-09-21 下午 16:40</div>
                                        </div>
                                    </a>
                                </li>

                                <li class="tpl-dropdown-menu-messages">
                                    <a href="javascript:;" class="tpl-dropdown-menu-messages-item am-cf">
                                        <i class="am-icon-circle-o"></i> 进入列表…
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <!-- 新提示 -->
                        <li class="am-dropdown" data-am-dropdown>
                            <a href="javascript:;" class="am-dropdown-toggle" data-am-dropdown-toggle>
                                <i class="am-icon-bell"></i>
                                <span class="am-badge am-badge-warning am-round item-feed-badge">5</span>
                            </a>

                            <!-- 弹出列表 -->
                            <ul class="am-dropdown-content tpl-dropdown-content">
                                <li class="tpl-dropdown-menu-notifications">
                                    <a href="javascript:;" class="tpl-dropdown-menu-notifications-item am-cf">
                                        <div class="tpl-dropdown-menu-notifications-title">
                                            <i class="am-icon-folder-o"></i>
                                            <span> 上午开会记录存档</span>
                                        </div>
                                        <div class="tpl-dropdown-menu-notifications-time">
                                            1天前
                                        </div>
                                    </a>
                                </li>

                                <li class="tpl-dropdown-menu-notifications">
                                    <a href="javascript:;" class="tpl-dropdown-menu-notifications-item am-cf">
                                        <i class="am-icon-bell"></i> 进入列表…
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <!-- 用户设置 -->
                        <li class="am-dropdown" data-am-dropdown>
                            <a href="javascript:;" class="am-dropdown-toggle" data-am-dropdown-toggle>
                                <i class="am-icon-cog"></i>
                            </a>

                            <!-- 弹出列表 -->
                            <ul class="am-dropdown-content tpl-dropdown-content user-setting">
                                <li class="tpl-dropdown-menu-notifications">
                                    <a href="javascript:;" class="tpl-dropdown-menu-notifications-item am-cf">
                                        <div class="tpl-dropdown-menu-notifications-title">
                                            <i class="am-icon-bell-o"></i>
                                            <span> 个人资料</span>
                                        </div>
                                    </a>
                                </li>
                                <li class="tpl-dropdown-menu-notifications">
                                    <a href="/1901/user/!changePass" class="tpl-dropdown-menu-notifications-item am-cf">
                                        <div class="tpl-dropdown-menu-notifications-title">
                                            <i class="am-icon-cog"></i>
                                            <span> 修改密码</span>
                                        </div>
                                    </a>
                                </li>

                                <li class="tpl-dropdown-menu-notifications">
                                    <a href="javascript:;" class="tpl-dropdown-menu-notifications-item am-cf"  @click="signOut">
                                        <div class="tpl-dropdown-menu-notifications-title">
                                            <i class="am-icon-sign-out"></i>
                                            <span> 退出</span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <!-- 退出 -->
                        <li class="am-text-sm">
                            <a href="javascript:;"  @click="signOut">
                                <span class="am-icon-sign-out"></span> 退出
                            </a>
                        </li>

                    </ul>
                </div>
            </div>

        </header>
        <!-- 风格切换 -->
        <div class="tpl-skiner" :class="{active:selectSkiner}">
            <div class="tpl-skiner-toggle am-icon-cog" @click="selectSkiner = !selectSkiner">
            </div>
            <div class="tpl-skiner-content">
                <div class="tpl-skiner-content-title">
                    选择主题
                </div>
                <div class="tpl-skiner-content-bar">
                    <span class="skiner-color skiner-white" @click="setTheme('theme-white')"></span>
                    <span class="skiner-color skiner-black" @click="setTheme('theme-black')"></span>
                </div>
            </div>
        </div>
        <!-- <div> -->
            <Sidebar :class="{active:isSidebarShow}" :style="autoHeight"></Sidebar>
            <!-- 内容区域 -->
            <div class="tpl-content-wrapper" :style="autoHeight" :class="{active:isSidebarShow}">
                <div style="overflow-y: auto;overflow-x: hidden;height:100%;width:100%;">
                    <router-view class="container-fluid am-cf" name="toc"></router-view>
                    <router-view></router-view>
                </div>
            </div>
        <!-- </div> -->
    </div>
</template>
<script>
import { mapGetters, mapActions,mapMutations } from 'vuex'
import * as api from "../../../public/js/netapi.js";
import Sidebar from "./sidebar";
import store from "../../store/index";
export default {
    data: function() {
        return {
            skiner:'theme-white',
            selectSkiner:false,
        }
    },
    store,
    components: {
        Sidebar
    },
    computed: {
        ...mapGetters([
            'user',
            'autoHeight',
            'isSidebarShow'
        ])
    },
    methods: {
        ...mapMutations([
            'setContentHeight',
            'toggleSidebar',
            'setTerm',
            'setPosts'
        ]),
        setTheme (theme){
            this.skiner = theme;
            // cookie.set
            // storageSave('SelcetColor',theme)
            localStorage.setItem('selectSkiner', theme);
        },
        async signOut(){
            let data = await api.logOut();
            layer.alert(data.msg, {
                closeBtn: 0
            },()=>{
                window.location.href="/";
            });
        }
    },
    mounted:async function() {
        this.skiner = localStorage.getItem('selectSkiner')||this.skiner;
        let headersHeight = 56;
        let setH = ()=> this.setContentHeight($(window).height()-headersHeight);
        setH();
        $(window).resize(setH);
    }
}
</script>
