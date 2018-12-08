<template>
    <div class="curd-container curd-container--flex">
        <curd class="curd-container--flex__left"
              :name="name"
              :columns="columns"
              :data="data"
              :fetch="fetchTerms"
              :formItem="formItem"
              :updateAction="edit"
              :deleteAction="deleteTermTag"
              :page-size="18"
              ref="curd"
        >
            <template slot="form-buttons" slot-scope="scope">
                <i-button icon="md-document" @click="insert" class="mr-2">新建标签</i-button>
                <i-button icon="md-trash" :disabled="scope.selectedNum === 0" @click="deleteTermTag(scope.selectedList)">删除</i-button>
            </template>
        </curd>
        <div class="curd-container--flex__modal">
            <right-modal :action="action" :target="modalFormItem"></right-modal>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import curd from '@/components/curd/curd'
import { dateFormat } from '@/utils/common'
import term from './term-curd-mixin'
import RightModal from './modal/tag-right-modal'

const renderDate = function (h, { row }) {
    return [dateFormat(row.createdAt)]
}

export default {
    name: 'post-tag',
    mixins: [term],
    data () {
        return {
            name: 'tag',
            columns: [
                { type: 'selection', width: 40, align: 'center' },
                // {title: 'ID', key: 'id', width: 90, sortable: true},
                { title: '标签名称', key: 'name', width: 150, sortable: true },
                { title: '计数', key: 'count', width: 90, sortable: true },
                { title: '标识', key: 'slug', width: 100 },
                { title: '说明', key: 'description' },
                { title: '创建时间', key: 'createdAt', width: 150, render: renderDate.bind(this) },
                { title: 'action', key: 'action', width: 200, type: 'action' }
            ],
            formItem: {
                key: ''
            }
        }
    },
    computed: {
        ...mapState({
            data: state => state.data.tagList
        })
    },
    components: {
        RightModal,
        curd
    },
    methods: {
        ...mapActions(['deleteTermTag'])
    }
}
</script>
