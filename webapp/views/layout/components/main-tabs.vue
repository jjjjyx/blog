<template>
    <!--<scrollbar> v-scrollbar="{suppressScrollY : true}"-->
    <div class="main-tabs-container">
        <template v-if="tabsScroll">
            <icon class="tabs-nav__prev" type="ios-arrow-back"></icon>
            <icon class="tabs-nav__next" type="ios-arrow-forward"></icon>
        </template>
        <!--{{visitedViews}}-->
        <div class="tabs-nav" v-context-menu="{menus: menus, targetEl: '.tabs-nav__item'}">
            <router-link tag="div"
                         class="tabs-nav__item " v-for="tab in visitedViews"
                         :to="tab"
                         :key="tab.name" ref="tabs" :class="{'tabs-nav__item--active': tab.name === $route.name}"
                         @click.middle.native="closeSelectedTab(tab)"
                         :data-path="tab.path"
                         :data-name="tab.name">
                <font-icon :type="tab.icon" v-if="tab.icon" :size="20" class="mr-2"></font-icon>
                <span class="tabs-nav__text">{{$t('router.' + tab.title)}}</span>
                <icon type="ios-close" class="tabs-nav__close" @click.prevent.stop="closeSelectedTab(tab)"></icon>
            </router-link>
        </div>

    </div>
    <!--</scrollbar>-->
</template>

<script>
import last from 'lodash/last'
import { homeRouter } from '@/router/menus'
import { mapActions } from 'vuex'

export default {
    name: 'tabs',
    data () {
        return {
            tabsScroll: false,
            menus: [
                {
                    key: 'contextmenu.close',
                    callback: (e, t) => {
                        let view = {
                            path: t.getAttribute('data-path'),
                            name: t.getAttribute('data-name')
                        }
                        this.closeSelectedTab(view)
                    }
                },
                {
                    key: 'contextmenu.close_other',
                    callback: (e, t) => {
                        let view = {
                            path: t.getAttribute('data-path'),
                            name: t.getAttribute('data-name')
                        }
                        this.closeOthersTabs(view)
                    }
                },
                {
                    key: 'contextmenu.close_all',
                    callback: () => {
                        this.closeAllTabs()
                    }
                }
                // {
                // 	key: '刷新',
                //     divided: true,
                // 	callback: (e, t) => {
                // 		let view = {
                // 			path: t.getAttribute('data-path'),
                // 			name: t.getAttribute('data-name')
                // 		}
                // 		this.refreshTab(view)
                // 	}
                // }
            ]
        }
    },
    computed: {
        visitedViews () {
            return this.$store.state.tabs.visitedViews
        }
    },
    methods: {
        ...mapActions(['addView', 'delView', 'delAllViews', 'delOthersViews']),
        addViewTabs () {
            const { name, meta, path, fullPath, query } = this.$route
            if (name) {
                this.addView({
                    name, path, fullPath, query, ...meta
                })
            }
        },
        async closeSelectedTab (tab) {
            if (this.visitedViews.length === 1 && tab.name === homeRouter.name) {
                this.$Message.warning(this.$t('messages.close_selected_tab'))
                return
            }
            await this.delView(tab)
            // console.log(this.visitedViews.length)
            if (tab.name === this.$route.name) { // 关闭当前标签页
                let lastTab = last(this.visitedViews)
                // console.log(lastTab)
                if (lastTab) {
                    this.$router.push(lastTab)
                } else {
                    this.$router.push('/')
                    // this.$nextTick(this.addViewTabs)
                }
            }
            // let visitedViews
        },
        async closeOthersTabs (view) {
            this.$router.push(view)
            await this.delOthersViews(view)
            // this.moveToCurrentTag()
        },
        closeAllTabs () {
            this.delAllViews()
            this.$router.push('/')
        },
        refreshTab () {

        }
    },
    watch: {
        '$route' () {
            this.addViewTabs()
            // this.moveToCurrentTag()
        }
    },
    mounted () {
        // console.log(this.$route)
        this.addViewTabs()
    }
}
</script>
