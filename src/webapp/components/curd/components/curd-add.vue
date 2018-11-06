<template>
    <Poptip placement="bottom-end" width="400" ref="addPoptip" transfer>
        <Tooltip :content="$t('curd.action.insert')">
            <Button type="text" icon="md-add"></Button>
        </Tooltip>

        <Form class="curd-fun-container" label-position="top" ref="form" :model="formData" slot="content">
            <h3 class="curd-fun__title">
                {{$t('curd.fun_insert_title', {name: $parent.labelName})}}
            </h3>
            <FormItem :label="$t(`${$parent.name}.columns.${column.key}`)" v-for="(column, index) in formItems" :key="index" v-if="column.type === 'text'">
                <Input v-model="formData[column.key]" placeholder=""/>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('form')" size="small">{{$t('curd.action.save')}}</Button>
                <Button @click="handleReset('form')" style="margin-left: 8px" size="small">{{$t('curd.action.reset')}}</Button>
            </FormItem>
        </Form>
    </Poptip>
</template>

<script>
    import api from '@/utils/api'
	const noAllowTypes = ['index', 'selection', 'expand', 'html', 'PK']
	export default {
		name: 'curd-add',
		props: {
			columns: {
				type: Array,
				required: true
			}
		},
		data () {
			return {
				formData: {},
				formItems: []
			}
		},
		created () {
			this.formItems = this.columns.filter((item) => {
				if (item.type) {
					return noAllowTypes.indexOf(item.type) === -1
				} else {
					return false
				}
			})
		},
		mounted () {
			// console.log('123123')
		},
		methods: {
			async addData (data) {
				try {
					await api.npost(this.$parent.addUrl, data)
					return true
				} catch (e) {
					this.$Message.error(this.$t('messages.curd.add_fail', e))
				}
			},
			async handleSubmit () {
				// console.log(this)
				let result = await this.addData(this.formData)
				if (result) {
					this.formData = {}
					this.$refs.addPoptip.cancel()
                    this.$parent.fetchData()
					// this.$emit('save-success')
				}
			},
			handleReset () {
				// this.$refs['form'].resetFields()
                this.formData = {}
			}
		}
	}
</script>
