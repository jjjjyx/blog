<template>
    <dropdown-menu>
        <template v-for="menu in menus">
            <Dropdown placement="right-start" v-if="menu.child">
                <dropdown-item  :divided="menu.divided" :disabled="menu.disabled" @click.native="menu.callback && menu.callback($parent)">
                    {{menu.label}}
                    <Icon type="ios-arrow-right"></Icon></dropdown-item>
                <context-menu-item slot="list" :menus="menu.child"></context-menu-item>
            </Dropdown>
            <dropdown-item v-else :divided="menu.divided" :disabled="menu.disabled" @click.native="menu.callback && menu.callback($parent)">{{menu.label}}</dropdown-item>
        </template>
    </dropdown-menu>
</template>

<script>
export default {
    name: 'context-menu-item',
    data() {
        return {}
    },
    props: {
        menus: {
            type: Array,
            required: true
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
