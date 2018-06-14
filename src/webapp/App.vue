<template>
    <div id="app">
        <layout class="wrapper">
            <sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'hidden'}" width="240">
                <div class="header-brands">
                    <router-link to="/" active-class='active' exact>
                        <!--http://oht47c0d0.bkt.clouddn.com/797d3a20-0016-11e7-8ec4-c526ba0271a0.png-->
                        <img src="http://oht47c0d0.bkt.clouddn.com/797d3a20-0016-11e7-8ec4-c526ba0271a0.png" alt="首页" title="返回首页">
                    </router-link>
                </div>
                <div class="sidebar-user-panel">
                    <div class="user-panel-profile-picture">
                        <img src="http://oht47c0d0.bkt.clouddn.com/140d5330-376d-11e7-81cc-c5fb8304dee6">
                    </div>
                    <div>
                        <span class="user-panel-logged-in-text"><Icon type="ios-circle-outline" color="#19be6b" size="12"></Icon> 酱酱酱酱油鲜</span>
                        <a href="javascript:void(0)" class="user-panel-action-link">
                            <Icon type="edit" size="12"></Icon>
                            <span> 账号设置</span></a>
                    </div>
                </div>
                <i-Menu  width="auto" accordion :active-name="1" class="menu-item" @on-select="handleSelectRouter" ref="sidebar" theme="dark">
                    <MenuGroup title="内容管理">
                        <Submenu name="2">
                            <template slot="title">
                                <Icon type="document"></Icon>
                                <span>文章管理</span>
                            </template>
                            <Menu-Item name="post_management">
                                <Icon type="document"></Icon>
                                <span>所有文章</span></Menu-Item>
                            <Menu-Item name="post_writer">
                                <Icon type="document"></Icon>
                                <span>撰写文章</span></Menu-Item>
                            <Menu-Item name="menu">
                                <Icon type="document"></Icon>
                                <span>分类管理</span>
                            </Menu-Item>
                            <Menu-Item name="post_trash">
                                <Icon type="document"></Icon>
                                <span>回收站</span></Menu-Item>
                        </Submenu>
                        <Menu-Item name="3">
                            <Icon type="document"></Icon>
                            <span>分类管理</span>
                        </Menu-Item>
                        <Menu-Item name="4">
                            <Icon type="document"></Icon>
                            <span>标签管理</span>
                        </Menu-Item>
                        <Menu-Item name="5">
                            <Icon type="document"></Icon>
                            <span>图片管理</span>
                        </Menu-Item>
                        <Menu-Item name="6">
                            <Icon type="document"></Icon>
                            <span>留言管理</span>
                        </Menu-Item>
                    </MenuGroup>
                    <MenuGroup title="系统">
                        <Menu-Item name="7">
                            <Icon type="document"></Icon>
                            <span>访客管理</span>
                        </Menu-Item>
                        <Menu-Item name="8">
                            <Icon type="document"></Icon>
                            <span>用户管理</span>
                        </Menu-Item>

                        <Menu-Item name="9">
                            <Icon type="document"></Icon>
                            <span>网站设置</span>
                        </Menu-Item>
                    </MenuGroup>
                </i-Menu>
            </sider>
            <layout :style="{marginLeft: '240px', minWidth:'1100px'}" class="wrapper-content">
                <header class="wrapper-header">
                    <i-Menu mode="horizontal" theme="dark" @on-select="handleSelect" ref="nav" >

                        <div class="wrapper-header-nav-list-right">
                            <Menu-Item name="1">
                                <Badge dot>
                                    <Icon type="email" size="20"></Icon>
                                </Badge>&nbsp;
                            </Menu-Item>
                            <Menu-Item name="2">
                                <Badge dot>
                                    <Icon type="ios-bell-outline" size="20"></Icon>
                                </Badge>&nbsp;
                            </Menu-Item>
                            <Submenu name="3" class="menu-user">
                                <template slot="title">
                                    <Avatar icon="person" size="small"/>
                                </template>
                                <Menu-Group title="Signed in as jjjjyx" style="width: 200px;overflow: hidden">
                                    <Menu-Item name="3-1">个人资料</Menu-Item>
                                    <Menu-Item name="3-2">活跃分析</Menu-Item>
                                    <Menu-Item name="3-3" @click.native="out" class="ivu-menu-item-divided">
                                        <Icon type="log-out" size="20"></Icon>
                                        退出登录
                                    </Menu-Item>
                                </Menu-Group>
                            </Submenu>
                        </div>
                        <div class="wrapper-header-nav-search">

                            <Auto-Complete v-model="value4" icon="ios-search" placeholder="搜索">
                                <div class="demo-auto-complete-item" v-for="(item,index) in data4" :key="index">
                                    <div class="demo-auto-complete-group">
                                        <span>{{ item.title }}</span>
                                        <a href="https://www.google.com/search?q=iView" target="_blank">更多</a>
                                    </div>
                                    <i-Option v-for="option in item.children" :value="option.title" :key="option.title">
                                        <span class="demo-auto-complete-title">{{ option.title }}</span>
                                        <span class="demo-auto-complete-count">{{ option.count }} 人关注</span>
                                    </i-Option>
                                </div>
                                <a href="https://www.google.com/search?q=iView" target="_blank"
                                   class="demo-auto-complete-more">查看所有结果</a>
                            </Auto-Complete>
                        </div>
                        <div class="wrapper-header-nav-list">
                            <!--<Menu-Item>-->
                            <!--<a href="${path}/group">小组文件</a>-->
                            <!--</Menu-Item>-->
                            <!--<Menu-Item>-->
                            <!--<a href="${path}/doc">我的文件</a>-->
                            <!--</Menu-Item>-->
                            <!--<Menu-Item>-->
                            <!--<a href="${path}/">管理</a>-->
                            <!--</Menu-Item>-->
                        </div>
                    </i-Menu>
                </header>
                <Breadcrumb>
                    <Breadcrumb-Item>主页</Breadcrumb-Item>
                    <Breadcrumb-Item>Components</Breadcrumb-Item>
                    <Breadcrumb-Item>Layout</Breadcrumb-Item>
                </Breadcrumb>
                <!--缓存组件，不需要缓存的可以使用 include 和 exclude 过滤-->
                <keep-alive>
                    <router-view class="ivu-layout-content wrapper-content"></router-view>
                </keep-alive>
                <footer class="layout-footer-center">
                    皖ICP备18009045号-1 &copy;2018 jjjjyx 版权所有 E-mail: <a href="mailto:#">jyx@rpgame.net</a>
                </footer>
            </layout>

        </layout>
    </div>
</template>

<script>
import store from './store'

export default {
    name: 'app',
    store,
    data: () => {
        return {
            value4: '',
            data4: [
                {
                    title: '话题',
                    children: [{title: 'iView', count: 10000}, {title: 'iView UI', count: 10600}]
                },
                {
                    title: '问题',
                    children: [{title: 'iView UI 有多好', count: 60100}, {title: 'iView 是啥', count: 30010}]
                }, {title: '文章', children: [{title: 'iView 是一个设计语言', count: 100000}]}]
        }
    },
    methods: {
        out: function out () {
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确认退出系统吗？</p>',
                onOk: function onOk () {
                    // api.npost("api/oauth/out").then(function () {
                    //     alert("成功退出登录");
                    //     location.reload();
                    // });
                },
                onCancel: function onCancel () {
                }
            })
        },
        handleSelect: function handleSelect (name) {
            // console.log(name);
        },
        handleSelectRouter: function (name) {
            this.$router.push({name})
        }
    }
}
</script>

<style>

</style>
