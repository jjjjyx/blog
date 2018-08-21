<template>
<layout class="wrapper" :class="wrapClasses">
    <!--<header class="wrapper__header">-->
        <!--22-->
    <!--</header>-->
    <aside class="wrapper__sidebar" :class="{'wrapper__sidebar--collapsed': collapsed}">
        <header class="logo-wrap"></header>
        <div class="sidebar-wrap"></div>
    </aside>
    <div class="wrapper__main">
        <main-header></main-header>
        <main-plugin></main-plugin>
        <main-breadcrumb></main-breadcrumb>
        <div class="main__content">
            <button @click="collapsed = !collapsed">collapsed sidebar</button>
        </div>
        <main-footer></main-footer>
    </div>
</layout>
</template>

<script>
import MainPlugin from './main-plugin'
import MainHeader from './main-header'
import MainFooter from './main-footer'
import MainBreadcrumb from './main-breadcrumb'
export default {
    name: 'cms-app2',
    data () {
        return {
            collapsed: false,

        }
    },
    components: {
        MainBreadcrumb,
        MainFooter,
        MainPlugin,
        MainHeader
    },
    computed: {
        wrapClasses () {
            // return {
            //     'wrapper--mini-sidebar': this.collapsed
            // }
        }
    }
}
</script>
