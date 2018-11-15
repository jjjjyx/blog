<template>
    <div class="ivu-alert ivu-alert-warning">
        <Tag checkable :color="type">标签四</Tag>
        <span class="main-alert__text">这里可以放一点提示信息。如果这些信息都能够做成多语言是最好啦~</span>
        <span class="main-alert__text main-alert__text--right">222</span>
    </div>
</template>

<script>
	export default {
		name: 'main-alert',
		data () {
			return {
				type: 'warning'
			}
		},
		computed: {
			warpStyles () {
				return [
					'ivu-alert',
					'ivu-alert-' + this.type
				]
			}
		}
	}
</script>