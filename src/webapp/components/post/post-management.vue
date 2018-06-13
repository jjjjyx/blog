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
                <i-Button type="ghost" icon="document">新建文章</i-Button>
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
            <span style="float: right">已全部加载，共3个</span>
            <span>全部文章</span>
        </div>
        <div class="cm-wrapper" ref="table-wrapper">
            <i-table :columns="columns" :data="data" class="cm-list-table" :height="tableHeight"></i-table>
        </div>
    </div>
</template>

<script>
import {on} from '@/utils/dom'
import _ from 'lodash'

export default {
    name: 'post-management',
    data: () => {
        return {
            filterForm: {
                key: '', term: '', status: ''
            },
            tableHeight: 400,
            columns: [
                {type: 'selection', width: 40, align: 'center'},
                {title: 'ID', key: 'id', sortable: true},
                {title: '标题', key: 'size', sortable: true},
                {title: '类别', key: 'uploader', sortable: true},
                {title: '作者/创建时间', key: 'auth', sortable: true},
                {title: '状态', key: 'status', sortable: true},
                {title: 'Action'}
            ],
            data: [
                {
                    id: 0,
                    ext: 'doc',
                    mimeType: 'application/msword',
                    name: 'a.doc',
                    originName: 'a.doc',
                    createdTime: '2018-6-4 12:21:52', // 数据创建时间 不是文件创建时间
                    remark: '文件描述',
                    size: '100126',
                    uid: {},
                    ascId: '12345555',
                    downNum: 5,
                    status: 'normal'
                }
            ]
        }
    },
    methods: {
        search: function search () {

        },
        fetchData: function fetchData () {

        }
    },
    created: function () {
        // console.log(this.$el,222)
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

<style scoped>

</style>
