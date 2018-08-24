<template>
    <div class="cm-container cm-container--flex">
        <curd class="cm-container--flex__left"
              :name="name"
              :columns="columns"
              :data="data"
              :url="url"
              :delTip="delTip"
              :fetch="fetchTerms"
              :formItem="formItem"
              :page-size="18"
              ref="curd"
        >
            <template slot="form-buttons" slot-scope="scope">
                <i-button type="ghost" icon="document" @click="insert">新建标签</i-button>
                <i-button type="ghost" icon="trash-a" :disabled="scope.selectedNum === 0">删除</i-button>
            </template>
        </curd>
        <div class="cm-container--flex__modal">
            <right-modal :url="url" :action="action" :target="modalFormItem"></right-modal>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {mapState} from 'vuex'
import curd from '@/components/curd/curd'

import {dateFormat} from '@/utils/common'
import term from './term-curd-mixin'
import CategoryName from './col/category-name'
import RightModal from './modal/tag-right-modal'
Vue.component('category-name', CategoryName)
const renderDate = function (h, {row}) {
    return h('div', dateFormat(row.createdAt))
}
const renderAction = function (h, {row}) {
    let edit = <i-button type="primary" size="small" class="mr-2" onClick={ e =>this.edit(row)}>修改</i-button>
    let del = <i-button type="error" size="small" on-click={ e=> this.$refs['curd'].del([row])}>删除</i-button>
    return [edit, del]
}

export default {
    name: 'post-category',
    mixins: [term],
    data () {
        let modalForm =  {name: '', slug: '', description: '', icon: ''};
        return {
            name:'标签',
            columns: [
                {type: 'selection', width: 40, align: 'center'},
                {title: 'ID', key: 'id', width: 90, sortable: true},
                {title: '标签名称', key: 'name', width: 150, sortable: true},
                {title: '计数', key: 'count', width: 90, sortable: true},
                {title: '标识', key: 'slug', width: 100},
                {title: '说明', key: 'description'},
                {title: '创建时间', key: '', width: 150, render: renderDate.bind(this)},
                {title: 'action', key: '', width: 130, render: renderAction.bind(this)}
            ],
            url: 'term/tag',
            delTip: '<p>确认删除标签?</p><p>删除标签导致引用失效</p>',
            formItem: {
                key: ''
            }
        }
    },
    computed: {
        ...mapState({
            data: state => state.data.tagList
        }),
    },
    components: {
        RightModal,
        curd
    }
}
</script>
