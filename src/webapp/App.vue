<template>
    <div id="app">
        <div class="wrapper">
            <div class="wrapper-header">
                <Menu mode="horizontal" theme="light" @on-select="handleSelect" ref="nav">
                    <div class="header-brands">
                        <router-link to="/" active-class='active' exact>
                            <img src="http://oht47c0d0.bkt.clouddn.com/797d3a20-0016-11e7-8ec4-c526ba0271a0.png" alt="首页" title="返回首页">
                        </router-link>
                    </div>
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
                </Menu>
            </div>
            <div class="wrapper-container">
                <row style="height: 100%">
                    <i-Col span="3" class="wrapper-navigate">
                        222
                        <!--<%@include file="/assets/base/user-sidebar-header.jsp"%>-->
                        <!--<i-Menu :open-names="openMenus" width="auto" accordion :active-name="activeName" class="menu-item" @on-select="handleSelectRouter" ref="sidebar">-->
                            <!--${sidebar}-->
                        <!--</i-Menu>-->
                    </i-Col>
                    <i-Col span="21" class="wrapper-content">
                        <Layout >
                            <!--<%&#45;&#45; 还没想好这个怎么搞  先放这里 好看&#45;&#45;%>-->
                            <Breadcrumb>
                                <Breadcrumb-Item>主页</Breadcrumb-Item>
                                <Breadcrumb-Item>Components</Breadcrumb-Item>
                                <Breadcrumb-Item>Layout</Breadcrumb-Item>
                            </Breadcrumb>
                            <!-- 缓存组件，不需要缓存的可以使用 include 和 exclude 过滤-->
                            <keep-alive>
                                <router-view class="ivu-layout-content"></router-view>
                            </keep-alive>
                        </Layout>
                    </i-Col>
                </row>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'app',
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
        }
    }
}
</script>

<style>

</style>
