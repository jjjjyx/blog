<template>
    <div class="curd-container">
        <div class="curd-toolbar ivu-row">
            <div class="ivu-col ivu-col-span-18">
                <Form :model="formItem" :label-width="50" inline class="curd-toolbar__filter-form" @submit.native.prevent="search">
                    <FormItem :label="$t('curd.search_label')">
                        <i-input v-model="formItem.key" :placeholder="$t('curd.search_placeholder')" clearable/>
                    </FormItem>
                    <slot name="form-items"></slot>
                    <FormItem>
                        <Button type="primary" shape="circle" icon="ios-search" @click="search"></Button>
                    </FormItem>
                </Form>
                <slot name="form-buttons" v-bind:selectedNum="selectedNum" v-bind:selectedList="selectedList"></slot>
            </div>
            <div class="curd-toolbar--right ivu-col ivu-col-span-6">

                <!--<curd-add :columns="tableColumns"/>-->
                <!--@save-success="fetchData()"-->
                <!-- todo 删除功能 因为不支持多选， 暂时关闭-->
                <!--<Tooltip :content="不支持多选" placement="top">-->
                <!--<Button type="text" icon="md-trash" @click="del(selectedList)" :disabled="selectedNum === 0"></Button>-->
                <!--</Tooltip>-->
                <!--<Button size="small" @click="test" :disabled="selectedNum === 0">tet</Button>-->
                <Tooltip :content="$t('curd.action.refresh')">
                    <Button type="text" icon="md-refresh" @click="fetchData(true)"></Button>
                </Tooltip>
                <slot name="form-opts"></slot>
            </div>
        </div>
        <div class="curd-header">
            <span style="float: right">{{$t('curd.total', [total])}}</span>
            <span>{{$t('curd.header_text', {name: labelName})}}{{selectedList.length ? '-'+ $t('curd.header_select_text', {num: selectedList.length}): ''}}</span>
        </div>
        <div class="curd-body" ref="table-wrapper">
            <i-table :columns="tableColumns" :data="pageData" stripe class="curd-body--table" ref="table"
                     @on-selection-change="_handleSelectChange" :no-data-text="$t('curd.empty_text')"
                     :height="tableHeight" :loading="tableStatus"></i-table>
        </div>
        <div class="curd-footer">
            <slot name="footer-action">
            </slot>
            <Page :total="total" :page-size="pageSize" size="small" class="float-right"
                  show-total
                  @on-change="_handleOnPageChange">
                {{$t('curd.page', [(currPage - 1) * pageSize + 1 , currPage * pageSize > total ? total : currPage *
                pageSize, total])}}
            </Page>
        </div>
        <!--<curd-update :columns="tableColumns" :name="name" :id-key="idKey" :label-name="labelName"  v-model="updateModalFormItem" :visible.sync="updateModalVisible"/>-->
        <slot></slot>
    </div>
</template>

<script>
    /*
        需要重新思考下这个curd 组件的作用

        首选curd 需要管理数据，传进的数据需要使用table ，而如果这个data 是vuex 的数据，那么有修改的地方就会不严格
        如果拷贝一份，而table组件也是拷贝一份，这样带来的消耗有点不值当

        如果只是当做一些常用的模块封装倒是可以

        比如 表格高度自动， 可以封装成指令

        整体结构就算了

        基础的增删改查方法可以单独封装

        f5 刷新模块可以使用混合

        选取：
           支持表格方式的选取，有表格的方法可以提供获取到已选择的部分
           想要支持自定义内容展示方式 给data 数据项加字段，或者复制一份数据与表格一样的实现

        另一种设想
            目前表格的使用仅仅使用了固定表头，而这个特性手动实现也不是多难 ，而利用css 特性实现的固定表头就不需要计算高度了
            从而不需要复制数据，可以在本组件中copy 数据，而不影响vuex
            但是如果对表格的要求增加，就会麻烦了
     */

	import debounce from 'lodash/debounce'
	import cloneDeep from 'lodash/cloneDeep'
	// import intersectionBy from 'lodash/intersectionBy'
	// import differenceBy from 'lodash/differenceBy'

	import { on, off } from '@/utils/dom'
	import { getMetaKeyCode } from '@/utils/common'
	// import api from '@/utils/api'

	// import CurdAdd from './components/curd-add'
	import renderAction from './components/curd-render-action'
	// import CurdUpdate from './components/curd-update'

	// const RESTFUL_ALIAS = {
	// 	// query: 'list',
	// 	// list: 'list',
	// 	save: '',
	// 	update: '',
	// 	delete: ''
	// }
	export default {
		name: 'curd',
		// components: {CurdUpdate}, // CurdAdd
		data () {
			return {
				confirmStatus: false,
				selectedList: [],
				tableStatus: false, // 表格加载状态
				tableHeight: 800, // 表格高度
				currPage: 1,
				tableColumns: [],
				tableData: cloneDeep(this.data),

				updateModalFormItem: {},
				updateModalVisible: false,

			}
		},
		props: {
			name: {
				type: String
			},
			idKey: {
				type: String,
				default: 'id'
			},
			formItem: {
				type: Object,
				default: () => ({key: ''})
			},
			columns: {
				type: Array,
				required: true
			},
			data: {
				type: Array,
				default: () => ([])
			},
			fetch: {
				type: Function,
				// default: this._fetchServerData
				required: true
			},
            deleteAction: {
                type: Function,
            },
            updateAction: {
                type: Function,
            },
            createAction: {
                type: Function,
            },
			pageSize: {
				type: Number,
				default: 10
			}
		},
		computed: {
			selectedNum: function () {
				return this.selectedList.length
			},
			pageData: function () {
				let start = (this.currPage - 1) * this.pageSize
				let end = start + this.pageSize
				return this.tableData.slice(start, end)
			},
			total: function () {
				return this.tableData.length
			},
            labelName: function () {
                return this.$t('curd.' + this.name)
			}
		},
		methods: {
			_handleKeyDown: function (e) {
				let keyCode = getMetaKeyCode(e)
				switch (keyCode) {
					case 4113: // 按下了 ctrl
					case 16400: // 按下了 shift
					case 20497: // 同时按下了 shift ctrl
					case 20496: // 同时按下了 ctrl shift
						this.keydownCode = keyCode
						break
					case 116: // 按下了F5
						this.fetchData()
						e.preventDefault()
						break
					default:
						this.keydownCode = null
				}
			},

			// 选择变化
			_handleSelectChange (value) {
				// 存在换页的可能 换页的时候会触发这个方法
				// if (value[0])
				//     value[0]._checked = true
				this.selectedList = value
				this.$emit('on-select-change', value)
                // this._updateDataSelectedStatus(this.data)
			},

			// async _defaultFetchData () {
			// 	try {
			// 		let result = (await api.nget(this.fetchUrl)) || []
			// 		result.forEach(i => (i._checked = false))
			// 		this._updateDataSelectedStatus(result)
			// 		// this.data = result
			// 		this.$emit('update:data', result)
			// 	} catch (e) {
			// 		this.$Message.error(this.$t('messages.curd.fetch_fail', {name: this.labelName, message: e.message}))
			// 	}
            //
			// },
			_updateDataSelectedStatus (tmp) {
				// 所以在这里更新数据的默认选中情况
				// console.log(tmp[0], this.selectedList[0], tmp[0]===this.selectedList[0])
				// differenceBy(tmp, )
				// let selected = intersectionBy(tmp, this.selectedList, this.idKey)
				// selected.forEach(item => item._checked = true)
				// this.$emit('update:data', tmp)
			},
			_handleOnPageChange (page) {
				this.currPage = page
                this.selectedList = []
				// this._updateDataSelectedStatus(this.data)
			},
			// async _updateToServer (obj) {
			// 	try {
			// 		await api.npost(this.editUrl, obj)
			// 		// let result =
            //         // console.log('update', result)
            //         return true
			// 	} catch (e) {
			// 		this.$Message.info(this.$t('messages.curd.update_fail', e))
            //
			// 	}
            // },
			// del (selected) {
			// 	if (!(selected instanceof Array)) {
			// 		selected = this.selectedList
			// 	}
			// 	if (selected.length === 0) {
			// 		return []
			// 	}
			// 	let ids = selected.map((item) => (item[this.idKey]))
            //
			// 	// 删除提示
			// 	return new Promise((resolve, reject) => {
			// 		this.$Modal.confirm ({
			// 			title: this.$t('messages.curd.del_warning_title'),
			// 			content: this.delTip ? this.delTip : this.$t('messages.curd.del_warning_content'),
			// 			onOk: async () => {
			// 				try {
			// 					// todo 不能同时删除多个
			// 					// selected.map
			// 					// Promise.all()
			// 					await api.nget(this.delUrl, {[this.deleteIdKey]: ids})
			// 					// this.$store.dispatch('del_' + this.url, selected)
			// 					this.$Message.success(this.$t('messages.curd.del_success'))
			// 					// 更新选中列表
			// 					this.selectedList = differenceBy(this.selectedList, selected, this.idKey)
			// 					// 这是删除后的列表， 因为会表格数据是拷贝的，所以会重新渲染，@see watch.data
            //
			// 					let tmpData = differenceBy(this.data, selected, this.idKey)
			// 					this._updateDataSelectedStatus(tmpData)
            //
			// 					// console.log(this.data)
			// 					resolve(selected)
			// 				} catch (e) {
			// 					this.$Message.info(this.$t('messages.curd.del_fail', e))
			// 					reject(e)
			// 				}
			// 			},
			// 			onCancel: reject
			// 		})
			// 	})
			// },

			search () {
            },


			update (obj) {
                // console.log(obj)
                // this.updateModalFormItem = obj
                // this.updateModalVisible = true
				// this.$Modal.info({
                //     title: '修改',
				// 	render: (h) => {
				// 		return h('span', 222)
				// 	}
				// })
			},
			// 获取数据
			async fetchData (force) {
				this.tableStatus = true
				let msg = this.$Message.loading({
					content: this.$t('curd.load_text'),
					duration: 0
				})
				await this.fetch(force)
				this.tableStatus = false
				msg()
			},
			// test () {
			// 	console.log(this.data[0])
            // }
		},
		created: function () {
			this.tableColumns = cloneDeep(this.columns)
			this.tableColumns.forEach((item) => {
				if (!(item.renderHeader && typeof item.renderHeader === 'function') && item.key) { // 沒有renderHeader
					item.renderHeader = (h, {column}) => {
                        return [this.$t(`${this.name}.columns.${column.key}`)]
					}
                }
				if (item.type === 'action') {
					// let render
					if (item.render && typeof item.render === 'function') {
						let render = item.render
						item.render = (...a) => {
                            let defaultActionBtn = renderAction.call(this, ...a)
							let custom = render(...a)
                            if (custom instanceof Array) {
								return custom.concat(defaultActionBtn)
                            } else {
                                return [custom, ...defaultActionBtn]
                            }
						}
                    } else {
						item.render =renderAction.bind(this)
                    }
				}
				if (item.width === 'auto') {
					item.width = 180
				}
			})

			this.fetchData(false)
			on(document.body, 'keydown', this._handleKeyDown)
		},
		watch: {
			'data':{
				handler: function () {
                    this.tableData = cloneDeep(this.data)
                },
                deep: true
            }
		},
		destroyed () {
			off(document.body, 'keydown', this._handleKeyDown)
		},
		mounted () {
			if (this.$refs['table-wrapper']) {
				let onResize = debounce(() => {
					this.tableHeight = this.$refs['table-wrapper'].clientHeight
				}, 1000)
				onResize()
				on(window, 'resize', onResize)
			}
		}
	}
</script>
