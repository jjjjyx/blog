<template>
    <header class="main-header-container">
        <div class="main-header__minimize" @click.stop="toggleSidebarMini">
            <font-icon :type="collapsed ? 'md-menu': 'ios-arrow-back'" :size="28"></font-icon>
        </div>
        <!--<div class="">-->
        <!--<h3 class="h3">{{last.title}} <small>{{last.name}}</small></h3>-->
        <transition-group name="breadcrumb" tag="Breadcrumb" class="main-header__breadcrumb">
            <BreadcrumbItem v-for="(item,index) in breadCrumbList" :key="item.name"
                            @click.native="handleSelectRouter(item, index)">
                <font-icon :type="item.icon" v-if="item.icon"></font-icon>
                {{$t('router.'+ item.title)}}
            </BreadcrumbItem>
        </transition-group>
        <div class="main-header--right">
            <template v-if="showDebug">
                <tooltip :content="$t('navbar.bug')">
                    <Badge dot :count="logs.length">
                        <Button type="error" icon="ios-bug-outline" size="small" @click="openErrorLog"></Button>
                    </Badge>
                </tooltip>
                <Modal v-model="errorModalVisible" :title="$t('navbar.bug')" width="90">
                    <Table :columns="errorColumns" :data="logs" class="error-table-warp"/>
                </Modal>
            </template>
            <tooltip :content="$t('navbar.screenFull')">
                <Button type="text" icon="md-qr-scanner" size="large" @click="screenFull"></Button>
            </tooltip>
            <Dropdown trigger="click" placement="bottom-end" @on-click="handleChangeI18n">
                <a href="javascript:void(0)">
                    {{$t('navbar.language')}}
                    <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem :key="item.name" :selected="language === item.name" :name="item.name"
                                  v-for="item in langs">
                        {{item.label}}
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Dropdown trigger="click" placement="bottom-end">
                <Avatar shape="square" icon="ios-person" class="mr-2"/>
                <Icon type="ios-arrow-down"></Icon>
                <DropdownMenu slot="list" style="width: 180px">
                    <div class="ivu-dropdown__header">{{$t('navbar.welcome')}}<b>{{user.nickname}}</b></div>
                    <DropdownItem divided>{{$t('navbar.userSet')}}</DropdownItem>
                    <!--<DropdownItem></DropdownItem>-->
                    <DropdownItem divided @click.native="logout">{{$t('navbar.logOut')}}</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    </header>
</template>

<script>
	// import last from 'lodash/last'
	import * as user from '../../../api/user'
	import api from '@/api'
    import { dateFormat } from '@/utils/common'
	import screenfull from 'screenfull'
	import { mapState, mapMutations, mapActions } from 'vuex'

	// eslint-disable-next-line
	function deepQuery (tree, name) {
		let stark = []

		stark = stark.concat(tree)

		while (stark.length) {
			let temp = stark.shift()
			if (name === temp.name) {
				return temp
			}
			if (temp.child) {
				stark = temp.child.concat(stark)
			}
		}
	}

	export default {
		name: 'navbar',
		data () {
			return {
				langs: [
					{name: 'zh-CN', label: '中文简体'},
					{name: 'zh-TW', label: '中文繁体'},
					{name: 'en-US', label: 'English'}
				],
				errorModalVisible: false,
				errorColumns: [
					{type: 'expand', width: 50, render: (h, {row}) => {return h('pre', row.err.stack)}},
					{title: 'type', key: 'name', width: 100, render: (h) => {/* <tag color="error">Error</tag>*/return h('tag', {props: {color: 'error'}}, 'Error')}},
					{title: 'msg', key: 'msg', maxWidth: 260, render: (h, {row}) => {return [row.err.message]}},
					{title: 'info', key: 'info'},
					{title: 'url', key: 'url'},
					{title: 'time', key: 'time', render: (h, {row}) => {return [dateFormat(row.time)]}}
				]
			}
		},
		computed: {
			...mapState({
				'breadCrumbList': 'breadCrumbList',
				'language': 'language',
				'collapsed': state => state.sidebar.collapsed,
				'menus': state => state.sidebar.menus,
				'user': state => state.user,
				'logs': state => state.errorLog.logs,
				'showDebug': state => state.errorLog.showDebug
			})

			// last: function () {
			// 	return last(this.breadCrumbList)
			// }
		},
		methods: {
			...mapActions(['toggleSidebarMini', 'setLanguage']),
			...mapMutations(['setBreadCrumb']),
			handleSelectRouter (item) {
				// console.log(item)
				// item.name
				// this.menus.forEach(()=>{
				//
				// })
				// todo 在面包屑导航上 有下级节点的给出下拉菜单
				// let menu = deepQuery(this.menus, item.name)
				//

				this.$router.push({name: item.name})
			},
			handleRouteChange () {
				let {matched} = this.$route
				this.setBreadCrumb(matched)
			},
			openErrorLog () {
				this.errorModalVisible = true
			},
			screenFull () {
				// throw new Error('asdasd')
				if (!screenfull.enabled) {
					this.$Message.warning(this.$t('messa ges.screen_full_warning'))
					return false
				}
				screenfull.toggle()
			},
			handleChangeI18n (lang) {
				this.$i18n.locale = lang
				this.setLanguage(lang)
				this.$Message.success(this.$t('messages.switch_language'))
			},
			logout () {
                user.logout().then(()=>{
                    api.token = null
                    location.reload()
                })
				// api.nget('/api/user/signout').then(() => {
				// 	api.token = null
				// 	location.reload()
				// })
			}
		},
		watch: {
			'$route': 'handleRouteChange'
		},
		created () {
			this.handleRouteChange()
		}
	}
</script>
