<template>
    <div class="curd-container curd-container--flex">
        <curd class="curd-container--flex__left"
              :name="name"
              :columns="columns"
              :data="data"
              :fetch="fetchTerms"
              :updateAction="edit"
              :deleteAction="deleteTermCategory"
              :formItem="formItem"
              ref="curd"
        >
            <template slot="form-buttons" slot-scope="scope">
                <i-button  icon="document" @click="insert">新建分类</i-button>
                <i-button  icon="trash-a" :disabled="scope.selectedNum === 0" @click="deleteTermCategory(scope.selectedList)">删除</i-button>
            </template>
        </curd>
        <div class="curd-container--flex__modal">
            <right-modal :action="action" :target="modalFormItem"></right-modal>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import {dateFormat} from '@/utils/common'
import curd from '@/components/curd/curd'
import term from './term-curd-mixin'
import RightModal from './modal/category-right-modal'
import CategoryName from './col/category-name'

Vue.component('category-name', CategoryName)
const renderDate = function (h, {row}) {
    return [dateFormat(row.createdAt)]
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
            name: 'category',
            columns: [
                {type: 'selection', width: 40, align: 'center'},
                // {title: 'ID', key: 'id', width: 100, sortable: true},
                {title: '分类名称', key: 'name', width: 280, sortable: true, render: renderName.bind(this)},
                {title: '文章数', key: 'count', width: 90, sortable: true},
                {title: '说明', key: 'description',minWidth: 300},
                {title: '创建时间', key: 'createdAt', width: 220, render: renderDate.bind(this)}
            ],
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
        ...mapActions(['deleteTermCategory'])
    },
    mounted () {
    }
}
</script>
