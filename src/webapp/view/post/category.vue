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
              ref="curd"
        >
            <template slot="form-buttons" slot-scope="scope">
                <i-button type="ghost" icon="document" @click="insert">新建分类</i-button>
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
import {dateFormat} from '@/utils/common'
import curd from '@/components/curd/curd'
import term from './term-curd-mixin'
import RightModal from './modal/category-right-modal'
import CategoryName from './col/category-name'

Vue.component('category-name', CategoryName)
const renderDate = function (h, {row}) {
    return h('div', dateFormat(row.createdAt))
}
const renderName = function (h, {row}) {
    return h('category-name', {
        props: {category: row},
        on: {
            del: () => {
                this.$refs['curd'].del([row])
                // this.remove([row])
            },
            edit: this.edit
        }
    })
}

export default {
    name: 'post-category',
    mixins: [term],
    data () {
        return {
            name: '分类',
            columns: [
                {type: 'selection', width: 40, align: 'center'},
                // {title: 'ID', key: 'id', width: 100, sortable: true},
                {title: '分类名称', key: 'name', width: 280, sortable: true, render: renderName.bind(this)},
                {title: '文章数', key: 'count', width: 90, sortable: true},
                {title: '说明', key: 'description'},
                {title: '创建时间', key: '', width: 220, render: renderDate.bind(this)}
            ],
            url: 'term/category',
            delTip: '<p>确认删除分类?</p><p>删除分类不会删除分类下的文章</p>',
            formItem: {
                key: ''
            }
        }
    },
    components: {
        RightModal,
        curd
    },
    computed: {
        ...mapState({
            data: state => state.data.categoryList
        })
    },
    methods: {
    },
    mounted () {
    }
}
</script>
