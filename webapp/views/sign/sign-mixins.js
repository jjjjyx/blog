export default {
	data () {
		return {
			redirect: undefined,
			loading: false,
		}
	},
	watch: {
		$route: {
			handler: function (route) {
				this.redirect = route.query && route.query.redirect
			},
			immediate: true
		}
	},
	method: {
		handleReset (name) {
			this.$refs[name].resetFields()
		}
	}
}