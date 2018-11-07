<template>
    <div class="wrapper">
        <Sidebar class="sidebar-container" ></Sidebar>
        <div class="main-container">
            <navbar class="main__header"/>
            <main-alert class="main__alert"/>
            <tabs class="main__tabs"/>
            <transition name="fade-transform" mode="out-in">
                <!--<keep-alive :include="cachedViews">-->
                <router-view :key="key" class="main__content"/>
                <!--</keep-alive>-->
            </transition>
            <main-footer/>
            <plugin class="main__plugin"></plugin>
        </div>
    </div>
</template>

<script>

	import Sidebar from './components/sidebar'
	import Navbar from './components/navbar'
	import plugin from './components/plugin'
	import Tabs from './components/tabs'
	import MainFooter from './components/main-footer'
	import MainAlert from './components/main-alert'

	export default {
		name: 'layout',
		components: {
			MainAlert,
			MainFooter,
			Tabs,
			Sidebar,
			Navbar,
			plugin
		},
		computed: {
			cachedViews() {
				return this.$store.state.tagsView.cachedViews
			},
			key() {
				return this.$route.fullPath
			}
		}
	}
</script>
