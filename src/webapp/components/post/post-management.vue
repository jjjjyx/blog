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
                <i-Button type="ghost" icon="document" @click="$router.push({name: 'post_writer', query: {active: 'new'}})">新建文章</i-Button>
                <i-Button type="ghost" icon="trash-a" @click="remove()" :disabled="selectedNum === 0">移至回收站</i-Button>

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
            <span style="float: right">已全部加载，共{{data.length}}篇文章</span>
            <span>全部文章</span>
        </div>
        <div class="cm-wrapper" ref="table-wrapper">
            <i-table :columns="columns" :data="data" stripe
                     class="cm-wrapper--table" ref="table"
                     @on-selection-change="handleSelectChange"
                     :loading="tableStatus"></i-table>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import {mapState, mapActions, mapGetters} from 'vuex'
// import {on} from '@/utils/dom'
import {dateFormat} from '@/utils/common'
import api from '@/utils/api'
import PostTitle from './col/post-title'
import crud from '../crud'
Vue.component('post-title', PostTitle)
const renderTitle = function (h, {row}) {
    return h('post-title', {
        props: {post: row},
        on: {
            trash: () => {
                this.remove([row])
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
        date = h('span', dateFormat(row.post_date))
    } else {
        flag = h('span', {domProps: {className: 'd-block'}}, '最后修改时间')
        date = h('span', dateFormat(row.updatedAt))
    }
    return h('div', [flag, date])
}

export default {
    name: 'post-management',
    mixins: [crud],
    data () {
        return {
            columns: [
                {type: 'selection', width: 40, align: 'center'},
                {title: '#', key: 'id', sortable: true, width: 70},
                {title: '标题', key: 'size', sortable: true, render: renderTitle.bind(this)},
                {title: '作者', key: 'auth', sortable: true, width: 220, render: renderAuthor.bind(this)},
                {title: '类别', key: '', width: 100, render: renderCategory.bind(this)},
                {title: '标签', key: '', width: 210, render: renderTags.bind(this)},
                {title: '评论', key: '', width: 80, sortable: true},
                {title: '日期', key: '', width: 220, render: renderDate.bind(this)}
            ],
            active: 'post'
            // delTip: '<p>确认?</p><p>删除分类不会删除分类下的文章</p>'
        }
    },
    computed: {
        ...mapState({
            data: state => state.data.posts
        }),
        ...mapGetters({
        })
    },
    methods: {
        ...mapActions({
            'fetch': 'fetchPosts'
            // 'trash': 'trashPosts'
        }),
        async remove (selected) {
            // 删除数据
            if (!(selected instanceof Array)) {
                selected = this.selectedList
            }

            let ids = selected.map((item) => (item[this.idKey]))
            try {
                await api.npost(`/api/${this.active}/trash`, {ids})
                this.$store.dispatch('del_' + this.active, selected)
            } catch (e) {
                this.$Message.info('删除失败')
            }
        }
    },
    mounted () {
    }
}
</script>
