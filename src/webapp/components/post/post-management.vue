<template>
    <div class="cm-container">
        <row>
            <i-col span="18">
                <i-Form :model="filterForm" :label-width="50" inline class="filter-form"
                        @submit.native.prevent="search">
                    <Form-Item label="关键字">
                        <Input v-model="filterForm.key" placeholder="标题/分类/标签/id" clearable/>
                    </Form-Item>
                    <Form-Item label="类别">
                        <i-Select v-model="filterForm.term">
                            <i-Option value="any">不限</i-Option>
                            <!--<i-Option value="male">男</i-Option>-->
                            <!--<i-Option value="girl">女</i-Option>-->
                        </i-Select>
                    </Form-Item>
                    <Form-Item label="状态">
                        <i-Select v-model="filterForm.status">
                            <i-Option value="all">所有</i-Option>
                            <!--<i-Option value="online">在职</i-Option>-->
                            <!--<i-Option value="offline">离职</i-Option>-->
                        </i-Select>
                    </Form-Item>
                    <FormItem>
                        <i-Button type="primary" shape="circle" icon="ios-search" @click="search"></i-Button>
                    </FormItem>
                </i-Form>
                <i-Button type="ghost" icon="document" @click="$router.push({name: 'post_writer'})">新建文章</i-Button>
                <i-Button type="ghost" icon="trash-a" @click="trash()" :disabled="selectedNum === 0">移至回收站</i-Button>

            </i-col>
            <i-col span="6">
                <div class="table-buttons" style="float: right">
                    <!--<i-Button type="text" icon="plus-circled"></i-Button>-->
                    <!--<i-Button  icon="plus-circled" @click="">上传文件</i-Button>-->
                    <!--<i-Button type="text" icon="edit" :disabled="userMultipleSelection.length!=1"-->
                    <!--@click="active='edit',currentUser = userMultipleSelection[0],openEditUserInfo()"></i-Button>-->
                    <Tooltip content="刷新">
                        <i-Button type="text" icon="loop" @click="fetchData"></i-Button>
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
            <span style="float: right">已全部加载，共{{data.length}}篇文章</span>
            <span>全部文章</span>
        </div>
        <div class="cm-wrapper" ref="table-wrapper">
            <i-table :columns="columns" :data="data" stripe class="cm-list-table" ref="table"
                     @on-selection-change="handleSelectChange"
                     :height="tableHeight" :loading="tableStatus"></i-table>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {on} from '@/utils/dom'
import _ from 'lodash'
import api from '@/utils/api'
import PostTitle from './col/post-title'
// import
Vue.component('post-title', PostTitle)
const renderTitle = function (h, {row}) {
    return h('post-title', {
        props: {post: row},
        on: {
            trash: () => {
                // this.multipleSelection = [row]
                this.trash(row)
            }
        }
    })
}

const renderAuthor = function (h, {row}) {
    return h('span', row.user.user_nickname)
}
const renderCategory = function (h, {row}) {
    let category = _.find(row.terms, ['taxonomy', 'category'])
    return h('Tooltip', {
        props: {
            content: category.description
        }
    }, category.name)
}
const renderTags = function (h, {row}) {
    let tags = _.filter(row.terms, ['taxonomy', 'post_tag'])
    let $tags = tags.map((tag) => {
        return h('Tooltip', {
            props: {
                content: tag.description || tag.name
            }
        }, [
            h('Tag', {props: {type: 'border'}}, tag.name)
        ])
    })
    return h('div', $tags)
}
const renderDate = function (h, {row}) {
    let flag
    let date
    if (row.post_status === 'publish') {
        flag = h('span', {domProps: {className: 'd-block'}}, '发布时间')
        date = h('span', row.post_date)
    } else {
        flag = h('span', {domProps: {className: 'd-block'}}, '最后修改时间')
        date = h('span', row.updatedAt)
    }
    return h('div', [flag, date])
}

export default {
    name: 'post-management',
    data () {
        return {
            filterForm: {
                key: '', term: '', status: ''
            },
            tableHeight: 400,
            columns: [
                {type: 'selection', width: 40, align: 'center'},
                // {title: 'ID', key: 'id', sortable: true},
                {title: '标题', key: 'size', sortable: true, render: renderTitle.bind(this)},
                {title: '作者', key: 'auth', sortable: true, width: 220, render: renderAuthor.bind(this)},
                {title: '类别', key: '', width: 100, render: renderCategory.bind(this)},
                {title: '标签', key: '', width: 210, render: renderTags.bind(this)},
                {title: '评论', key: '', width: 80, sortable: true},
                {title: '日期', key: '', width: 220, render: renderDate.bind(this)}
            ],
            data: [],
            tableStatus: false
        }
    },
    computed: {
        selectedList: function () {
            return this.data.filter((item) => item._checked)
        },
        selectedNum: function () {
            return this.selectedList.length
        }
    },
    methods: {
        search: function search () {

        },
        fetchData: async function fetchData () {
            this.tableStatus = true
            try {
                let data = await api.nget('/api/post/')
                data.forEach(i => (i._checked = false))
                this.data = data
            } catch (e) {
                this.data = []
                this.$Message.info('获取文章数据失败!')
            } finally {
                this.tableStatus = false
            }
        },
        async trash (item) {
            // console.log(this.multipleSelection)
            let ids
            if (item) {
                ids = [item.id]
            } else {
                ids = this.selectedList.map(i => (i.id))
            }
            try {
                await api.npost('/api/post/trash', {ids})
                if (item) {
                    let index = _.findIndex(this.data, ['id', item.id])
                    this.data.splice(index, 1)
                } else {
                    this.data = _.differenceBy(this.data, this.selectedList, 'id')
                }
            } catch (e) {
                this.$Message.info('失败，请重试')
            }
        },
        handleSelectChange () {
            this.data.forEach((item, index) => {
                let rowDate = this.$refs.table.objData[index]
                item._checked = rowDate._isChecked
            })
        }
    },
    created: function () {
        // console.log(this.$el,222)
        // this.fetchData()
    },
    beforeRouteEnter: function (to, from, next) {
        next(vm => {
            vm.fetchData()
        })
    },
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
