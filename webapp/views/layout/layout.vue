<template>
    <div class="wrapper">
        <Sidebar class="sidebar-container" ></Sidebar>
        <div class="main-container">
            <main-header class="main__header"/>
            <main-alert class="main__alert"/>
            <main-tabs class="main__tabs"/>
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
	import MainHeader from './components/main-header-1.vue'
    import MainPlugin from './components/main-plugin'
	import MainTabs from './components/main-tabs'
	import MainFooter from './components/main-footer'
	import MainAlert from './components/main-alert'

	export default {
		name: 'layout',
		components: {
			MainAlert,
			MainFooter,
            MainHeader,
            MainPlugin,
			MainTabs,
			Sidebar
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
