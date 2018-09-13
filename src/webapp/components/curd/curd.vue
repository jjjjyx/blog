<template>
<div>
    <row>
        <i-col span="18">
            <Form :model="formItem" :label-width="50" inline class="filter-form"
                  @submit.native.prevent="search">
                <FormItem label="关键字">
                    <!--标题/分类/标签/id-->
                    <Input v-model="formItem.key" placeholder="搜索.." clearable/>
                </FormItem>
                <slot name="form-items" ></slot>
                <!--<FormItem label="类别">-->
                    <!--<Select v-model="formItem.term">-->
                        <!--<Option value="any">不限</Option>-->
                        <!--&lt;!&ndash;<i-Option value="male">男</i-Option>&ndash;&gt;-->
                        <!--&lt;!&ndash;<i-Option value="girl">女</i-Option>&ndash;&gt;-->
                    <!--</Select>-->
                <!--</FormItem>-->
                <!--<FormItem label="状态">-->
                    <!--<Select v-model="formItem.status">-->
                        <!--<i-Option value="all">所有</i-Option>-->
                        <!--&lt;!&ndash;<i-Option value="online">在职</i-Option>&ndash;&gt;-->
                        <!--&lt;!&ndash;<i-Option value="offline">离职</i-Option>&ndash;&gt;-->
                    <!--</Select>-->
                <!--</FormItem>-->
                <FormItem>
                    <Button type="primary" shape="circle" icon="ios-search" @click="search"></Button>
                </FormItem>
            </Form>
            <slot name="form-buttons" v-bind:selectedNum="selectedNum"></slot>
            <!--<Button type="ghost" icon="document" @click="$router.push({name: 'post_writer', query: {active: 'new'}})">新建文章</Button>-->
            <!--<Button type="ghost" icon="trash-a" @click="remove()" :disabled="selectedNum === 0">移至回收站</Button>-->

        </i-col>
        <i-col span="6">
            <div class="table-buttons" style="float: right">
                <!--<i-Button type="text" icon="plus-circled"></i-Button>-->
                <!--<i-Button  icon="plus-circled" @click="">上传文件</i-Button>-->
                <!--<i-Button type="text" icon="edit" :disabled="userMultipleSelection.length!=1"-->
                <!--@click="active='edit',currentUser = userMultipleSelection[0],openEditUserInfo()"></i-Button>-->
                <Tooltip content="刷新">
                    <Button type="text" icon="loop" @click="_fetchData(true)"></Button>
                </Tooltip>
                <slot name="form-opts"></slot>
                <!--<Dropdown>-->
                    <!--<Button type="text" icon="arrow-swap" class="sort-order-btn"></Button>-->
                    <!--<DropdownMenu slot="list">-->
                        <!--<DropdownItem>时间</DropdownItem>-->
                        <!--<DropdownItem>文件大小</DropdownItem>-->
                        <!--<DropdownItem>日期</DropdownItem>-->
                    <!--</DropdownMenu>-->
                <!--</Dropdown>-->
            </div>
        </i-col>
    </row>
    <div class="cm-header">
        <span style="float: right">已全部加载，共{{total}}</span>
        <span>全部{{name}}</span>
    </div>
    <div class="cm-body" ref="table-wrapper">
        <i-table :columns="columns" :data="pageData" stripe class="cm-body--table" ref="table"
                 @on-selection-change="_handleSelectChange"
                 :height="tableHeight" :loading="tableStatus"></i-table>
    </div>
    <div class="cm-footer">
        <Page :total="total" :page-size="pageSize" size="small"
              show-total
              @on-change="(v)=> currPage = v">
            当前显示第 {{(currPage - 1) * pageSize + 1}} 到第 {{currPage * pageSize > total ? total : currPage * pageSize}} 条记录，共 {{total}} 条
        </Page>
    </div>
</div>
</template>

<script>
import _ from 'lodash'
import {on, off} from '@/utils/dom'
import {getMetaKeyCode} from '@/utils/common'
import api from '@/utils/api'
export default {
    name: 'curd',
    data () {
        return {
            confirmStatus: false,
            selectedList: [],
            tableStatus: false, // 表格加载状态
            tableHeight: 400, // 表格高度
            currPage: 1
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
        url: {
            type: String,
            required: true
        },
        delTip: {
            type: String,
            default: '确认删除？'
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
            required: true
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
            return this.data.slice(start, end)
        },
        total: function () {
            return this.data.length
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
                this._fetchData()
                e.preventDefault()
                break
            default:
                this.keydownCode = null
            }
        },
        // 获取数据
        async _fetchData (force) {
            this.tableStatus = true
            let msg = this.$Message.loading({
                content: 'Loading...',
                duration: 0
            })
            await this.fetch(force)
            this.tableStatus = false
            msg()
        },
        // 选择变化
        _handleSelectChange (value) {
            // 存在换页的可能
            this.selectedList = value
            this.$emit('on-select-change', value)
        },
        del (selected) {
            if (!(selected instanceof Array)) {
                selected = this.selectedList
            }

            let ids = selected.map((item) => (item[this.idKey]))
            // 删除提示
            return new Promise((resolve, reject) => {
                this.$Modal.warning({
                    title: '删除提示',
                    content: this.delTip,
                    onOk: async () => {
                        try {
                            await api.npost(`/api/${this.url}/del`, {ids})
                            this.$store.dispatch('del_' + this.url, selected)
                            this.$Message.success('删除成功')
                            this.selectedList = _.differenceBy(this.selectedList, selected, this.idKey)
                            resolve()
                        } catch (e) {
                            this.$Message.info('删除失败')
                            reject(e)
                        }
                    },
                    onCancel: reject
                })
            })
        },

        search () {}
    },
    created: function () {
        this._fetchData(false)
        on(document.body, 'keydown', this._handleKeyDown)
    },
    destroyed () {
        off(document.body, 'keydown', this._handleKeyDown)
    },
    mounted () {
        if (this.$refs['table-wrapper']) {
            let onResize = _.debounce((e) => {
                this.tableHeight = this.$refs['table-wrapper'].clientHeight
            }, 1000)
            onResize()
            on(window, 'resize', onResize)
        }
    }
}
</script>
