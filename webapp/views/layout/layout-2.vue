<template>
    <div class="wrapper layout-style-v2">
        <!-- todo 放一些欢迎用于， 比如检查时间 中午上午下午晚上好之类的 ，天气模块-->
        <Sidebar class="sidebar-container" ></Sidebar>
        <div class="main-container">
            <main-header class="main__header"/>
            <!--<main-alert class="main__alert"/>-->
            <!--<tabs class="main__tabs"/>-->
            <!--<main-tabs class="main__tabs" />-->
            <transition name="fade-transform" mode="out-in">
                <keep-alive>
                    <router-view  class="main__content"></router-view>
                </keep-alive>
            </transition>
            <main-footer/>
            <main-plugin class="main__plugin"></main-plugin>
        </div>
    </div>
</template>

<script>

	import Sidebar from './components/sidebar'
	import MainHeader from './components/main-header-2'
    import MainTabs from './components/main-tabs'
	import MainPlugin from './components/main-plugin'
	import MainFooter from './components/main-footer'
	import MainAlert from './components/main-alert'

	export default {
		name: 'layout',
		components: {
			MainAlert,
			MainFooter,
            MainTabs,
            MainHeader,
            MainPlugin,
			Sidebar
		},
		computed: {
			cachedViews() {
				return this.$store.state.tabs.cachedViews
			},
			// key() {
			// 	return this.$route.fullPath
			// }
		},
        mounted () {
        }
	}
</script>
