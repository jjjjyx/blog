<template>
    <dropdown-menu>
        <template v-for="(menu, index) in menus">
            <Dropdown placement="right-start" v-if="menu.child" :key="index">
                <dropdown-item  :divided="menu.divided" :disabled="menu.disabled" @click.native="menu.callback && menu.callback(clickTargetOriginEvent, clickTarget)">
                    {{menu.label}}
                    <Icon type="ios-arrow-right"></Icon></dropdown-item>
                <context-menu-item slot="list" :menus="menu.child"></context-menu-item>
            </Dropdown>
            <dropdown-item :key="index" v-else :divided="menu.divided" :disabled="menu.disabled" @click.native="menu.callback && menu.callback(clickTargetOriginEvent, clickTarget)">{{menu.label}}</dropdown-item>
        </template>
    </dropdown-menu>
</template>

<script>
export default {
    name: 'context-menu-item',
    data () {
        return {}
    },
    props: {
        menus: {
            type: Array,
            required: true
        }g
    },
    computed: {
        clickTargetOriginEvent () {
            return this.$root.originEvent
        },
        clickTarget () {
            return this.$root.target
        }
    },
    mounted () {
        // let handleClick = () => {
        //     // this.$nextTick(() => {
        //     this.visible = false;
        //     // })
        // }
        // this.$on('on-hover-click', handleClick)
        // this.$on('on-haschild-click', handleClick)
    }
}
</script>
