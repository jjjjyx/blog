<template>
    <div>
        <div class="curd-toolbar ivu-row">
            <div class="ivu-col ivu-col-span-18">
                <Form :model="formItem" :label-width="50" inline class="curd-toolbar__filter-form"
                      @submit.native.prevent="$$search">
                    <FormItem :label="$t('curd.search_label')">
                        <i-input v-model="formItem.key" :placeholder="$t('curd.search_placeholder')"
                                 clearable></i-input>
                    </FormItem>
                    <slot name="form-items"></slot>
                    <FormItem>
                        <Button type="primary" shape="circle" icon="ios-search" @click="$$search"></Button>
                    </FormItem>
                </Form>
                <slot name="form-buttons" v-bind:selectedNum="selectedNum" v-bind:selectedList="selectedList"></slot>
            </div>
            <div class="curd-toolbar--right ivu-col ivu-col-span-6">
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
                     @on-sort-change="_handleSort"
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
        <slot></slot>
    </div>
</template>

<script>

import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import orderBy from 'lodash/orderBy'
import { on, off } from '@/utils/dom'
import { getMetaKeyCode } from '@/utils/common'
import renderAction from './components/curd-render-action'

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
            updateModalVisible: false

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
            default: () => ({ key: '' })
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
        sortMethod: {
            type: Function
        },
        // filterAction: {
        //     type: Function
        // },
        // 点击确认删除后的操作
        deleteAction: {
            type: Function
        },
        // 点击编辑执行的操作
        updateAction: {
            type: Function
        },
        createAction: {
            type: Function
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
        // // 过滤列表
        // filterTableData: function () {
        //     return this.filterAction && this.filterAction(this.tableData) || this.tableData
        // },
        // 过滤后的列表分页
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
        },

        _handleOnPageChange (page) {
            this.currPage = page
            this.selectedList = []
        },
        _handleSort ({ column, key, order }) {
            // 虽然在这里可以实现公共的排序，但是内部的data 是副本，改变顺畅可能会影响外部取序号的操作所以只能调用外部方法
            // 坚持了发现 好像并没有做对序号的操作，修改删除方法都是返回的当前选择对象的副本，不会返回序号
            if (this.sortMethod) {
                this.sortMethod(column, key, order)
            } else {
                if (order === 'normal') {
                    this.tableData = cloneDeep(this.data)
                } else {
                    this.tableData = orderBy(this.tableData, [key], [order])
                }
            }
        },

        $$delete (selected) {
            if (!this.deleteAction) {
                throw new Error('尚未指定删除实现')
                // return
            }
            if (!(selected instanceof Array)) {
                selected = this.selectedList
            }
            if (selected.length === 0) {
                return []
            }
            // let ids = selected.map((item) => (item[this.idKey]))

            // 删除提示
            return new Promise((resolve, reject) => {
                this.$Modal.confirm({
                    title: this.$t('messages.curd.del_warning_title'),
                    content: this.delTip ? this.delTip : this.$t('messages.curd.del_warning_content'),
                    onOk: async () => {
                        try {
                            this.deleteAction(selected)
                            resolve(selected)
                        } catch (e) {
                            this.$Message.info(this.$t('messages.curd.del_fail', e))
                            reject(e)
                        }
                    },
                    onCancel: reject
                })
            })
        },

        $$search () {
            if (this.filterAction) {
                this.filterAction(this.formItem)
            }
        },

        $$update (row) {
            if (this.updateAction) {
                this.updateAction(row)
            }
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
        }
    },
    created: function () {
        this.tableColumns = cloneDeep(this.columns)
        this.tableColumns.forEach((item) => {
            if (!(item.renderHeader && typeof item.renderHeader === 'function') && item.key) { // 沒有renderHeader
                item.renderHeader = (h, { column }) => {
                    return [this.$t(`${this.name}.columns.${column.key}`)]
                }
            }
            if (item.sortable) { // 转换排序为自定义
                item.sortable = 'custom'
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
                    item.render = renderAction.bind(this)
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
        'data': {
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
