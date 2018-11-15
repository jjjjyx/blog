import PerfectScrollbar from 'perfect-scrollbar'

export default {
	bind (el, binding) {
		let {value} = binding
		el.ps = new PerfectScrollbar(el, value)
	},
	update (el) {
		el.ps.update()
	},
	unbind (el) {
		el.ps.destroy()
		// PerfectScrollbar
	}
	// name: 'scrollbar',
	// props: {
	// 	settings: {
	// 		default: undefined
	// 	}
	// },
	// render (h) {
	// 	let defaultEL = this.$slots.default
	// 	if (defaultEL.length > 1)
	// 		throw new Error('只允许单个节点 (Only a single node is allowed)')
	// 	console.log(defaultEL)
	// 	return defaultEL[0]
	// },
	// mounted() {
	// 	this._init()
	// },
	// // destroyed () {
	// // 	this._destroy()
	// // },
	// method: {
	// 	_init () {
	// 		this.ps = new PerfectScrollbar(this.$el, this.settings)
	// 	},
	// 	_update() {
	// 		if (this.ps)
	// 			this.ps.update()
	// 	},
	// 	_destroy() {
	// 		if (this.ps) {
	// 			this.ps.destroy()
	// 			this.ps = null
	// 		}
	// 	},
	// },
	// updated() {
	// 	this.$nextTick(this._update)
	// }
}

