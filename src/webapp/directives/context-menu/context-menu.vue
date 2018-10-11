<template>
<div class="ivu-dropdown">
    <transition name="transition-drop" >
    <div class="context-menu__warp ivu-select-dropdown" v-show="visible" :style="menuStyles">
        <ContextMenu :menus="menus"></ContextMenu>
    </div>
    </transition>
</div>
</template>

<script>
import ContextMenu from './menus'
export default {
    name: 'Dropdown',
    data () {
        return {
            visible: false,
            x: 0,
            y: 0,
            menus: [],
            originEvent: null,
            target: null
        }
    },
    components: {ContextMenu},
    computed: {
        menuStyles () {
            return {
                'transform-origin': 'center top 0px',
                top: this.y + 'px',
                left: this.x + 'px'
            }
        }
    },
    methods: {
        showMenu (e, target) {
            let {clientX, clientY} = e
            this.x = clientX
            this.y = clientY
            this.originEvent = e
            this.target = target
            this.watchMenusDisabled()
            this.visible = true
        },
        hideMenu (x, y) {
            this.visible = false
        },
        watchMenusDisabled () {
            this.menus.forEach(function __ (item) {
                item._disabled = typeof item.disabled === 'function' ? item.disabled() : item.disabled
                if (item.child) {
                    item.child.forEach(__)
                }
            })
        }
    },
    mounted () {
        let handleClick = () => {
            // this.$nextTick(() => {
            this.visible = false
            // })
        }
        this.$on('on-click', handleClick)
        // this.$on('on-haschild-click', handleClick)
    }
}
</script>
<style>
    .context-menu__warp {
        position: fixed;
        z-index: 1000;
    }
    .context-menu__warp .ivu-dropdown-menu {
        min-width: 150px;
    }
    /*.context-menu__warp .ivu-select-dropdown {*/
        /*animation-duration: 0s;*/
    /*}*/

    .transition-drop-appear,.transition-drop-enter-active,.transition-drop-leave-active {
        animation-duration: .3s;
        animation-fill-mode: both;
        animation-play-state: paused
    }

    .transition-drop-appear,.transition-drop-enter-active {
        animation-name: ivuTransitionDropIn;
        animation-play-state: running
    }

    .transition-drop-leave-active {
        animation-name: ivuTransitionDropOut;
        animation-play-state: running
    }

    .transition-drop-appear,.transition-drop-enter-active {
        opacity: 0
    }

    .transition-drop-appear,.transition-drop-enter-active,.transition-drop-leave-active {
        animation-timing-function: ease-in-out
    }
    @keyframes ivuTransitionDropOut {
        0% {
            opacity: 1;
            transform: scaleY(1)
        }

        to {
            opacity: 0;
            transform: scaleY(.8)
        }
    }

</style>
