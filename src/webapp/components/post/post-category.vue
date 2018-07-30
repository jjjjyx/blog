<template>
    <div class="cm-container">
        <row>
            <i-col span="18">
                <i-Form :model="filterForm" :label-width="50" inline class="filter-form"
                        @submit.native.prevent="search">
                    <Form-Item label="关键字">
                        <Input v-model="filterForm.key" placeholder="名称" clearable/>
                    </Form-Item>

                    <FormItem>
                        <i-Button type="primary" shape="circle" icon="ios-search" @click="search"></i-Button>
                    </FormItem>
                </i-Form>
                <i-button type="ghost" icon="document" @click="createCategory">新建分类</i-button>
                <i-button type="ghost" icon="trash-a" @click="deleteCategory()" :disabled="selectedNum === 0">移至回收站</i-button>

            </i-col>
            <i-col span="6">
                <div class="table-buttons" style="float: right">
                    <!--<i-Button type="text" icon="plus-circled"></i-Button>-->
                    <!--<i-Button  icon="plus-circled" @click="">上传文件</i-Button>-->
                    <!--<i-Button type="text" icon="edit" :disabled="userMultipleSelection.length!=1"-->
                    <!--@click="active='edit',currentUser = userMultipleSelection[0],openEditUserInfo()"></i-Button>-->
                    <Tooltip content="刷新">
                        <i-Button type="text" icon="loop" @click="fetchData(true)"></i-Button>
                    </Tooltip>
                    <Dropdown>
                        <i-Button type="text" icon="arrow-swap" class="sort-order-btn"></i-Button>
                        <DropdownMenu slot="list">
                            <DropdownItem>时间</DropdownItem>
                            <DropdownItem>文件大小</DropdownItem>
                            <DropdownItem>日期</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </i-col>
        </row>
        <div class="cm-header">
            <span style="float: right">已全部加载，共{{data.length}}个分类</span>
            <span>全部文章</span>
        </div>
        <div class="cm-wrapper" ref="table-wrapper">
            <i-table :columns="columns" :data="data" stripe
                     class="cm-list-table" ref="table"
                     @on-selection-change="handleSelectChange"
                     :height="tableHeight" :loading="tableStatus"></i-table>
        </div>
        {{selectedList}}
    </div>
</template>

<script>
import Vue from 'vue'
import {on} from '@/utils/dom'
// import _ from 'lodash'
import CategoryName from './col/category-name'
import {mapState, mapActions, mapGetters} from 'vuex'
import {dateFormat} from '../../utils/common'

Vue.component('category-name', CategoryName)
const renderDate = function (h, {row}) {
    return h('div', dateFormat(row.createdAt))
}
const renderName = function (h, {row}) {
    return h('category-name', {
        props: {category: row},
        on: {
            del: this.deleteCategory
        }
    })

}
export default {
    name: 'post-category',
    data () {
        return {
            filterForm: {
                key: '', term: '', status: ''
            },
            tableHeight: 400,
            columns: [
                {type: 'selection', width: 40, align: 'center'},
                // {title: 'ID', key: 'term_id', width: 100, sortable: true},
                {title: '分类名称', key: 'name', width: 380, sortable: true, render: renderName.bind(this)},
                // {title: '文章数', key: 'count', width: 100, sortable: true},
                {title: '说明', key: 'description'},
                {title: '创建时间', key: '', width: 220, render: renderDate.bind(this)}
                // {title: '作者', key: 'auth', sortable: true, width: 220, render: renderAuthor.bind(this)},
                // {title: '类别', key: '', width: 100, render: renderCategory.bind(this)},
                // {title: '标签', key: '', width: 210, render: renderTags.bind(this)},
                // {title: '评论', key: '', width: 80, sortable: true},

            ],
            // data: [],
            tableStatus: false
        }
    },
    computed: {
        ...mapState({
            data: state => state.term.categoryList
        }),
        ...mapGetters({
            'selectedList': 'selectedCategory',
            // 'data': 'categoryList'
            // 'categoryValue': 'categoryValue'
        }),
        selectedNum: function () {
            return this.selectedList.length
        }
    },
    methods: {
        ...mapActions({
            'fetchTerms': 'fetchTerms',
        }),
        search: function search () {

        },
        // 创建新分类
        createCategory: function createCategory () {

        },
        async fetchData (force) {
            this.tableStatus = true
            await this.fetchTerms(force)
            this.tableStatus = false
        },
        handleSelectChange () {
            this.data.forEach((item, index) => {
                let rowDate = this.$refs.table.objData[index]
                item._checked = rowDate._isChecked
            })
        },
        deleteCategory (e, category) {
            console.log(e, category)
        }
    },
    created: function () {
        // console.log(this.$el,222)
        this.fetchData(false)
    },
    // beforeRouteEnter: function (to, from, next) {
    //     next(vm => {
    //         vm.fetchData(false)
    //     })
    // },
    mounted () {
        let h = this.$refs['table-wrapper'].clientHeight
        this.tableHeight = h
        let onResize = _.debounce((e) => {
            let h = this.$refs['table-wrapper'].clientHeight
            this.tableHeight = h
        }, 1000)
        on(window, 'resize', onResize)
    }
}
</script>
