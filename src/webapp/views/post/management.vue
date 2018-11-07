<template>
    <curd :columns="columns" class="curd-container"
          :formItem="formItem"
          :name="name"
          :data="data"
          :fetch="fetchPosts"
          :pageSize="11"
    >
        <form-item label="类别" slot="form-items">
            <i-select v-model="formItem.term">
                <i-option value="any">不限</i-option>
            </i-select>
        </form-item>
        <form-item label="状态" slot="form-items">
            <i-select v-model="formItem.status">
                <i-option value="all">所有</i-option>
            </i-select>
        </form-item>
        <template slot="form-buttons" slot-scope="scope">
            <i-button icon="md-document" class="mr-2" @click="newPost">新建文章</i-button>
            <i-button icon="md-trash" :disabled="scope.selectedNum === 0" @click="trash(scope.selectedList)">移至回收站</i-button>
        </template>
    </curd>
</template>

<script>
import find from 'lodash/find'
import filter from 'lodash/filter'
import Vue from 'vue'
import {mapState, mapActions} from 'vuex'
import {dateFormat} from '@/utils/common'
import curd from '../../components/curd/curd.vue'
// import api from '@/utils/api'
import PostTitle from './col/post-title'

Vue.component('post-title', PostTitle)
const renderTitle = function (h, {row}) {
    return h('post-title', {
        props: {post: row},
        on: {
            trash: this.trash
        }
    })
}

const renderAuthor = function (h, {row}) {
    return h('span', row.user.user_nickname)
}
const renderCategory = function (h, {row}) {
    let category = find(row.terms, ['taxonomy', 'category'])
    return h('Tooltip', {
        props: {
            content: category.description
        }
    }, category.name)
}
const renderTags = function (h, {row}) {
    let tags = filter(row.terms, ['taxonomy', 'post_tag'])
    let $tags = tags.map((tag) => {
        return h('Tooltip', {
            props: {
                content: tag.description || tag.name
            }
        }, [
            h('Tag', {props: {type: 'border'}}, tag.name)
        ])
    })
    return $tags
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
    return [flag, date]
}


export default {
    name: 'post-management',
    data () {
        return {
            name: 'post',
            columns: [
                {type: 'selection', width: 40, align: 'center'},
                {title: '#', key: 'id', sortable: true, width: 70},
                {title: '标题', key: 'title', sortable: true, render: renderTitle.bind(this), minWidth: 200},
                {title: '作者', key: 'auth', sortable: true, width: 220, render: renderAuthor.bind(this)},
                {title: '类别', key: 'category', width: 100, render: renderCategory.bind(this)},
                {title: '标签', key: 'tags', width: 210, render: renderTags.bind(this)},
                {title: '评论', key: 'comment', width: 80, sortable: true},
                {title: '日期', key: 'date', width: 220, render: renderDate.bind(this)}
            ],
            formItem: {key: '', term: 'any', status: 'all'},
            // selectedList: [],
            url: 'post'
            // delTip: '<p>确认?</p><p>删除分类不会删除分类下的文章</p>'
        }
    },
    components: {
        curd
    },
    computed: {
        ...mapState({
            data: state => state.data.posts
        })
        // selectedNum: function () {
        //     return this.selectedList.length
        // },
    },
    methods: {
        ...mapActions({
            'fetchPosts': 'fetchPosts',
            'trash': 'deletePost'
            // 'trash': 'trashPosts'
        }),
        newPost () {
            this.$router.push({name: 'post_writer', query: {active: 'new'}})
        }
        // handleSelectChange (value) {
        //     this.selectedList = value
        // },
    },
    // render (h) {
    //     let props = {
    //         name: this.name,
    //         columns: this.columns,
    //         data: this.data,
    //         url: this.url,
    //         fetch: this.fetchPosts,
    //         formItem: this.formItem,
    //         pageSize: 11
    //     }
    //     let formItem = this.formItem
    //     return <curd ref="curd" {...{
    //         props,
    //         scopedSlots: {
    //             'form-buttons': scope => {
    //                 let newpb = <i-button slot="form-buttons"  icon="document" class="mr-2" onClick={this.newPost}>新建文章</i-button>
    //                 let tb = <i-button slot="form-buttons"  icon="trash-a" disabled={scope.selectedNum === 0}>移至回收站</i-button>
    //                 return [newpb, tb]
    //             }
    //         }
    //     }
    //     }>
    //         <form-item label="类别" slot="form-items">
    //             <i-select on-input={e => (formItem.term = e)} {...{props: {value: formItem.term}}}>
    //                 <i-option value="any">不限</i-option>
    //             </i-select>
    //         </form-item>
    //         <form-item label="状态" slot="form-items">
    //             <i-select on-input={e => (formItem.status = e)} {...{props: {value: formItem.status}}}>
    //                 <i-option value="all">所有</i-option>
    //             </i-select>
    //         </form-item>
    //     </curd>
    // },
    mounted () {
    }
}

</script>
