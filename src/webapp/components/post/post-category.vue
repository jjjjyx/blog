<template>
    <div class="cm-container cm-container--flex">
        <div class="cm-container--flex__left">
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
                    <i-button type="ghost" icon="trash-a" @click="remove()" :disabled="selectedNum === 0">删除</i-button>

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
                <!--<div class="">-->
                <i-table :columns="columns" :data="data" stripe
                         class="cm-wrapper--table" ref="table"
                         @on-selection-change="handleSelectChange"
                         :height="tableHeight" :loading="tableStatus"></i-table>
                <!--</div>-->
            </div>
        </div>
        <div class="cm-container--flex__modal">
            <Card >
                <p slot="title">添加新分类</p>
                <Form :model="formItem" :label-width="100" ref="form" :rules="ruleValidate" >
                    <FormItem label="分类名称" prop="name">
                        <Input v-model="formItem.name" placeholder="请输入分类名称"
                               :maxlength="10"/>
                    </FormItem>
                    <!--todo 一个选择图标的方案-->
                    <!--<Poptip placement="left" width="800">-->
                        <!--<FormItem label="分类图标">-->
                            <!--<a href="javascript:;">选择图标</a>-->
                            <!--&lt;!&ndash;<Input v-model="formItem.icon" placeholder="Enter something..." />&ndash;&gt;-->
                        <!--</FormItem>-->
                        <!--<div class="icon-select-panel" slot="content">-->

                        <!--</div>-->
                    <!--</Poptip>-->
                    <FormItem label="分类图标">
                    <!--<a href="javascript:;">选择图标</a>-->
                        <Input v-model="formItem.icon" placeholder="输入icon" />
                    </FormItem>
                    <FormItem label="分类说明" prop="description">
                        <Input v-model="formItem.description" type="textarea"
                               :maxlength="140"
                               :autosize="{minRows: 2,maxRows: 5}"
                               placeholder="分类备注"/>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="add('form')">添加</Button>
                        <Button type="ghost" style="margin-left: 8px" @click="reset('form')">重置</Button>
                    </FormItem>
                </Form>
            </Card>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import CategoryName from './col/category-name'
import {mapState, mapActions, mapGetters} from 'vuex'
import {dateFormat} from '../../utils/common'
import crud from './crud'

Vue.component('category-name', CategoryName)
const renderDate = function (h, {row}) {
    return h('div', dateFormat(row.createdAt))
}
const renderName = function (h, {row}) {
    return h('category-name', {
        props: {category: row},
        on: {
            del: () => {
                this.remove([row])
            }
        }
    })
}

export default {
    name: 'post-category',
    mixins: [crud],
    data () {
        return {
            columns: [
                {type: 'selection', width: 40, align: 'center'},
                // {title: 'ID', key: 'id', width: 100, sortable: true},
                {title: '分类名称', key: 'name', width: 380, sortable: true, render: renderName.bind(this)},
                {title: '文章数', key: 'count', width: 100, sortable: true},
                {title: '说明', key: 'description'},
                {title: '创建时间', key: '', width: 220, render: renderDate.bind(this)}
                // {title: '作者', key: 'auth', sortable: true, width: 220, render: renderAuthor.bind(this)},
                // {title: '类别', key: '', width: 100, render: renderCategory.bind(this)},
                // {title: '标签', key: '', width: 210, render: renderTags.bind(this)},
                // {title: '评论', key: '', width: 80, sortable: true},
            ],
            active: 'term/category',
            delTip: '<p>确认删除分类?</p><p>删除分类不会删除分类下的文章</p>',
            formItem: {
                name: '',
                slug: '',
                description: '',
                icon: ''
            },
            ruleValidate: {
                name: [
                    { required: true, message: 'The name cannot be empty', trigger: 'blur' },
                    {type: 'string', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/, trigger: 'blur', message: '名称只能包含中文英文，下划线，数字,且在长度不超过10！'}
                ],
                description: [
                    {type: 'string', max: 140, trigger: 'blur', message: '备注请控制在140字内'}
                ]
            }
        }
    },
    computed: {
        ...mapState({
            data: state => state.data.categoryList
        }),
        ...mapGetters({
        })
    },
    methods: {
        ...mapActions({'fetch': 'fetchTerms'}),
        search: function search () {},
        // 创建新分类
        createCategory: function createCategory () {}
    },
    mounted () {
    }
}
</script>
