<template>
<aside :class="wrapperSidebarClasses" :style="wrapperSidebarStyles">
    <router-link to="/" active-class='active' exact
                 class="sidebar-header__item header-brands wrapper__sidebar--divided" tag="header">
        <!--http://image.cdn.mbdoge.cn/797d3a20-0016-11e7-8ec4-c526ba0271a0.png-->
        <div class="header-brands__logo" title="返回首页">
            <logo/>
        </div>
        <div class="header-brands__title" title="返回首页">
            dashboard
        </div>
        <!--<div class="header-brands__minimize" @click.stop="toggleSidebarMini">-->
            <!--<font-icon :type="collapsed ? 'icon-pin': 'ios-arrow-back'" :size="16"></font-icon>-->
        <!--</div>-->
    </router-link>
    <div class="sidebar-header__item header-user wrapper__sidebar--divided">
        <div class="header-user__image">
            <img src="http://image.cdn.mbdoge.cn/140d5330-376d-11e7-81cc-c5fb8304dee6" alt="">
        </div>
        <div class="header-user__info">
            <h6>{{user.user_nickname}}</h6>
            <!-- todo 网页开启一段时间无动作，进入忙碌状态 -> 离线 -->
            <span><span class="ivu-tag-dot-inner"></span>online</span>
        </div>
    </div>
    <Menu width="auto" ref="sidebar" class="sidebar-menu-wrap" v-scrollbar="{suppressScrollX : true}"
          :accordion="accordion" :active-name="activeName" :open-names="openedNames"
          @on-select="handleSelectRouter" @on-open-change="handleOpenSubmenu">
        <sidebar-item v-for="route in menus" :item="route" :key="route.path" :base-path="route.path"></sidebar-item>
    </Menu>
</aside>
</template>

<script>
// import PerfectScrollbar from 'perfect-scrollbar'
import Emitter from '@/mixins/emitter.js'
import { mapState, mapActions } from 'vuex'
import SidebarItem from './sideba-menu-item.js'
import Logo from './logo'

export default {
	mixins:[Emitter],
    name: 'sidebar',
    components: {Logo, SidebarItem},
    data () {
        return {
			accordion: true,
			activeName: null,
			openedNames: [],
        }
    },
	computed: {
		// ...mapGetters([
		// 	'permissionRouters',
		// 	// 'sidebar'
		// ]),
		...mapState({
            'menus': state => state.sidebar.menus,
			'collapsed': state => state.sidebar.collapsed,
			'backgroundColor': state => state.sidebar.backgroundColor,
			'backgroundImage': state => state.sidebar.backgroundImage,
			'color': state => state.sidebar.color,
			'image': state => state.sidebar.image,
            'user': state => state.user
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
			for (let matched of this.$route.matched) {
				let cn = matched.name
				if (name !== cn) {
					names.push(cn)
				}

			}
			return names
		},
		// updateOpenName (name) {
		//     if (name === 'home') this.openedNames = []
		//     else this.openedNames = this.getOpenedNamesByActiveName(name)
		// },
		handleSelectRouter: function (name) {
			// let {name} = this.item
            // console.log(this.$router)
			this.$router.push({name})
		},
		handleOpenSubmenu () {
			// this.ps.update()
        }
    },
	watch: {
		'$route': function () {
			let {name} = this.$route
			this.activeName = name
			// if (this.accordion) {
			// this.openedNames = this.getOpenedNamesByActiveName(name)
        },
		'openedNames': function () {
			this.$nextTick(() => {
				this.$refs.sidebar.updateActiveName()
				this.$refs.sidebar.updateOpened()
				// this.handleOpenChange()
			})
		}
	},
    // destroyed () {
    //     this.ps.destroy()
    //     this.ps = null
    // },
    mounted () {
        // console.log(this.menus)
		let {name} = this.$route
		this.activeName = name
		// if (this.accordion) {
        this.openedNames = this.getOpenedNamesByActiveName(name)
		// this.ps = new PerfectScrollbar(this.$refs.sidebar.$el)
        // this.handleOpenChange()
		// }
    }
}
</script>
