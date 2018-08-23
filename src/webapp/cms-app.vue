<template>
<layout class="wrapper">
    <!--<header class="wrapper__header">-->
        <!--22-->
    <!--</header>-->
    <aside class="wrapper__sidebar" :class="wrapperSidebarClasses" :style="wrapperSidebarStyles">

        <router-link to="/" active-class='active' exact class="sidebar-header__item header-brands wrapper__sidebar--divided" tag="header">
            <!--http://oht47c0d0.bkt.clouddn.com/797d3a20-0016-11e7-8ec4-c526ba0271a0.png-->
            <div class="header-brands__logo" title="返回首页">
                <img src="http://oht47c0d0.bkt.clouddn.com/12f2aa30-3174-11e7-a772-3734af15197f.png" alt="首页">
            </div>
            <div class="header-brands__title" title="返回首页">
                mbdoge<span>.cn</span>
            </div>
            <div class="header-brands__minimize" @click.stop="toggleSidebarMini">
                <font-icon :type="collapsed ? 'icon-pin': 'ios-arrow-left'" :size="16"></font-icon>
            </div>
        </router-link>
        <div class="sidebar-header__item header-user wrapper__sidebar--divided">
            <div class="header-user__image">
                <img src="http://oht47c0d0.bkt.clouddn.com/140d5330-376d-11e7-81cc-c5fb8304dee6" alt="">
            </div>
            <div class="header-user__info">
                <h6>酱酱酱酱油鲜</h6>
                <span><Icon type="record" color="green"></Icon>online</span>
            </div>
        </div>
        <!--<form class="sidebar-header__item header-form">-->
            <!--<div class="ivu-form-item">-->
                <!--<Input v-model="input" placeholder="搜索菜单..." />-->
            <!--</div>-->
        <!--</form>-->
        <!--<div class="sidebar-wrap">-->
        <Menu width="auto" :accordion="accordion" :active-name="activeName" class="menu-item sidebar-wrap"  ref="sidebar" :open-names="openedNames">
            <!--<menu-group v-for="(group, index) in sidebarGroups" v-bind:key="index" >-->
                <template v-for="(item, item_index) in sidebarMenus">
                    <template v-if="item.subMenus">
                        <submenu :name="item.name" v-bind:key="item_index" class="sidebar-menu__item">
                            <template slot="title">
                                <font-icon :type="item.icon"></font-icon>
                                <span>{{item.title}}</span>
                            </template>
                            <MenuItem :name="menu.name || `${item_index}_${menu_index}`"
                                       v-for="(menu, menu_index) in item.subMenus" v-bind:key="menu_index"
                                       @click.native="handleSelectRouter(menu, item)" v-if="!menu.hideInMenu">
                                <font-icon :type="menu.icon"></font-icon>
                                <span>{{menu.title}}</span>
                            </MenuItem>
                        </submenu>
                    </template>
                    <MenuItem v-else-if="!item.hideInMenu" class="sidebar-menu__item"
                              :name="item.name || `${item_index}`" :key="item_index" @click.native="handleSelectRouter(item)">
                        <font-icon :type="item.icon"></font-icon>
                        <span class>{{item.title}}</span>
                    </MenuItem>
                </template>
            <!--</menu-group>-->
        </Menu>
        <!--</div>-->
        <!--<side-menu></side-menu>-->
    </aside>
    <div class="wrapper__main">
        <main-header></main-header>
        <main-plugin></main-plugin>
        <main-breadcrumb></main-breadcrumb>
        <keep-alive>
            <router-view class="main__content"></router-view>
        </keep-alive>
        <!--<div class="main__content">-->
            <!--<button @click="toggleSidebarMini">collapsed sidebar</button>-->
        <!--</div>-->
        <main-footer></main-footer>
    </div>
</layout>
</template>

<script>
import _ from 'lodash'
import store from './store/index'
import MainPlugin from './components/main/main-plugin'
import MainHeader from './components/main/main-header'
import MainFooter from './components/main/main-footer'
import MainBreadcrumb from './components/main/main-breadcrumb'
import {mapState, mapActions} from 'vuex'
import SideMenu from './components/sidebar/side-menu'
import menus from './router/router'
export default {
    name: 'cms-app2',
    store,
    data () {
        return {
            activeName: null,
            openedNames: [],
            sidebarMenus: menus,
            accordion: true
        }
    },
    components: {
        SideMenu,
        MainBreadcrumb,
        MainFooter,
        MainPlugin,
        MainHeader
    },
    computed: {
        ...mapState({
            'collapsed': state => state.sidebar.collapsed,
            'backgroundColor': state => state.sidebar.backgroundColor,
            'backgroundImage': state => state.sidebar.backgroundImage,
            'color': state => state.sidebar.color,
            'image': state => state.sidebar.image
        }),
        wrapperSidebarClasses () {
            return {
                'wrapper__sidebar--collapsed': this.collapsed,
                [`wrapper__sidebar--background-${this.backgroundColor}`]: !!this.backgroundColor,
                [`wrapper__sidebar--color-${this.color}`]: !!this.color
            }
        },
        wrapperSidebarStyles () {
            let style = {}
            if (this.image) {
                style['background-image'] = `url(${this.backgroundImage})`
            }
            return style
        }
    },
    methods: {
        ...mapActions(['toggleSidebarMini']),
        getOpenedNamesByActiveName (name) {
            let names = []
            for (let matchedKey in this.$route.matched) {
                let cn = this.$route.matched[matchedKey].name
                let pn = this.$route.matched[matchedKey].meta.parent
                if (name !== cn)
                    names.push(this.$route.matched[matchedKey].name)
                if (pn && name !== pn) {
                    names.push(pn)
                }
            }
            return names
        },
        updateOpenName (name) {
            if (name === 'home') this.openedNames = []
            else this.openedNames = this.getOpenedNamesByActiveName(name)
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
        '$route.name': function (val) {
            this.activeName = val
            if (this.accordion) {
                this.openedNames = this.getOpenedNamesByActiveName(val)
            } else {

            }
        },
        'openedNames': function (val) {
            this.$nextTick(() => {
                this.$refs.sidebar.updateActiveName()
                this.$refs.sidebar.updateOpened()
            })
        }
    },
    mounted () {
        // console.log(111, this.getOpenedNamesByActiveName(name), this.$route)
        // this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    }
}
</script>
