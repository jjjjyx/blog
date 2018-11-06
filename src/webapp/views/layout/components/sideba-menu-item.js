import TextIcon from './text-icon'

export default {
	name: 'sidebar-item',
	props: {
		// route object
		item: {
			type: Object,
			required: true
		},
		isNest: {
			type: Boolean,
			default: false
		},
		basePath: {
			type: String,
			default: ''
		}
	},
	components: {
		TextIcon
	},
	// eslint-disable-next-line
	render (h) {
		let {child, name, hide, title, icon, textIcon} = this.item
		if (hide) return

		let i18nName = this.$t('router.' + title)
		let $icon
		if (icon) {
			$icon = <font-icon class="sidebar-menu__icon" type={icon}/>
		} else {
			$icon = <text-icon class="sidebar-menu__icon--text" text={textIcon || i18nName[0]}/>
		}

		let $name = <span class="sidebar-menu__name">{i18nName}</span>

		// let handle = this.handleOpenChange
		if (child && child.length > 0) { // 有子菜单
			return <submenu name={name}>
				<template slot="title">
					{[$icon, $name]}
				</template>
				{
					child.map((i) => <sidebar-item item={i} />)
				}
			</submenu>
		// } else if (!hide) {
		} else {
			return <menu-item name={name}>
				{[$icon,$name]}
			</menu-item>
		}
	},
	method: {
		// handleSelectRouter: function () {
		// 	let {name} = this.item
		// 	this.$router.push({name})
		// }
	},
	mounted () {
	}
}
