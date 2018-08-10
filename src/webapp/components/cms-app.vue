<template>
    <layout class="wrapper">
        <div class="wrapper__sidebar wrapper__sidebar--collapsed">
            22
        </div>
        <div class="wrapper__content">
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
                                <Menu-Item name="3-3" @click.native="out" class="ivu-menu-item-divided"><Icon type="log-out" size="20"></Icon>退出登录</Menu-Item>
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
                <router-view class="ivu-layout-content"></router-view>
            </keep-alive>
            <footer class="layout-footer-center">
                皖ICP备18009045号-1 &copy;2018 jjjjyx 版权所有 E-mail: <a href="mailto:#">jyx@rpgame.net</a>
            </footer>
        </div>

    </layout>
</template>

<script>
import _ from 'lodash'
import store from '../store/index'

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
                }, {title: '文章', children: [{title: 'iView 是一个设计语言', count: 100000}]}],
            activeName: null,
            openedNames: [],
            sidebarGroups: [
                {
                    title: '内容管理',
                    items: [
                        {
                            title: '文章管理',
                            name: 'post',
                            icon: 'icon-guanliwenzhang',
                            subMenus: [ // 有subMenus 必须有name
                                {title: '所有文章', name: 'post_management', icon: 'icon-fabuwenzhang'},
                                {title: '撰写文章', name: 'post_writer', icon: 'icon-combinedshapecopy2'},
                                {title: '分类管理', name: 'post_category', icon: 'icon-ziyuan1'},
                                {title: '标签管理', name: 'post_tag', icon: 'pricetag'},
                                // {title: 'test', name: 'post_test', icon: 'pricetag'},
                                {title: '回收站', name: 'post_trash', icon: 'ios-trash'}
                            ]
                        },
                        {title: '媒体管理', name: '', icon: 'camera'},
                        {title: '留言管理', name: '', icon: 'ios-chatbubble-outline'}
                    ]
                },
                {
                    title: '系统',
                    items: [
                        {title: '访客管理', name: '', icon: 'coffee'},
                        {title: '用户管理', name: '', icon: 'ios-people-outline'},
                        {title: '网站设置', name: '', icon: 'levels'}
                    ]
                }
            ]
        }
    },
    methods: {
        out: function out () {
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确认退出系统吗？</p>',
                onOk: function onOk () {
                    // api.npost("api/oauth/out").then(function () {
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
        handleSelectRouter: function (menu, parent) {
            let name = menu.name
            if (name === 'post_writer') { // 撰写文章单独处理
                let poi = this.$store.state.post.id
                if (poi && _.isNumber(poi)) { // 存在文章
                    this.$router.push({name, query: {poi}})
                } else { // 不存在， 创建文章，在跳转
                    // this.$store.dispatch('createNewPost').then(() => {
                    //     poi = this.$store.state.post.id
                    //     this.$router.push({name, query: {poi}})
                    // })
                    this.$router.push({name, query: {active: 'new'}})
                }
            } else {
                this.$router.push({name})
            }
        }
    },
    watch: {
        '$route': function (val) {
            if (val) {
                this.activeName = val.name
                let ar = val.name.split('_')
                if (ar.length > 1) {
                    this.openedNames = [ar[0]]
                }
                this.$nextTick(() => {
                    // this.$refs.sidebar.updateOpened()
                })
            }
        }
    },
    mounted () {
        // this.$nextTick(()=>{
        //     console.log(this.$router.history.current)
        // })
    }
}
</script>
