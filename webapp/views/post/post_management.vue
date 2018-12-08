<template>
    <curd :columns="columns" class="curd-container"
          :formItem="formItem"
          :name="name"
          :data="filterData"
          :fetch="fetchPosts"

          :pageSize="11"
    >
        <form-item label="分类" slot="form-items">
            <i-select v-model="formItem.category" style="width: 100px">
                <i-option value="all">所有</i-option>
                <i-option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.name }}</i-option>
            </i-select>
        </form-item>
        <form-item label="状态" slot="form-items">
            <i-select v-model="formItem.status" style="width: 100px">
                <i-option value="all">所有</i-option>
                <i-option v-for="(v, k) in postStatusDict" :value="v" :key="k">{{ v }}</i-option>
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
import { mapState, mapActions } from 'vuex'
import { dateFormat } from '@/utils/common'
import curd from '../../components/curd/curd.vue'
import PostTitle from './col/post-title'
import * as post from '@/api/posts'

Vue.component('post-title', PostTitle)
const renderTitle = function (h, { row }) {
    return h('post-title', {
        props: { post: row },
        on: {
            trash: this.trash
        }
    })
}

const renderAuthor = function (h, { row }) {
    return h('span', row.user.user_nickname)
}
const renderCategory = function (h, { row }) {
    let category = find(row.terms, ['taxonomy', 'category'])
    if (row._editCategory) {
        return [<i-select style="width:60px" placeholder="选择图片空间" value={category.id} size="small" onInput={(v) => this.$handleChangePostCategory(row, v)}>
            {this.categoryList.map(item => <i-option value={item.id}>{item.name}</i-option>)}
        </i-select>,
            <font-icon type="md-close" class="ml-1" size="20" color="red" onClick={() => row._editCategory = false}/>
        ]
    } else {
        let editIcon = <font-icon type="ios-create-outline" class="ml-1 curd-table-options" size="20" onClick={() => row._editCategory = true}/>
        return [<tooltip content={category.description}>{category.name}</tooltip>, editIcon]
    }
}
const renderTags = function (h, { row }) {
    // 快速修改分类就不做了，不经常该多大使用
    let tags = filter(row.terms, ['taxonomy', 'post_tag'])
    return tags.map((tag) => <tooltip content={tag.description || tag.name}>
        <tag type="border">{tag.name}</tag>
    </tooltip>)
}
const renderDate = function (h, { row }) {
    let dates = []
    if (row.post_status === 'publish') {
        dates.push(<b>发布于:</b>)
        dates.push(dateFormat(row.post_date))
        dates.push(<br/>)
    }
    dates.push(<b>更新于:</b>)
    dates.push(dateFormat(row.updatedAt))
    return dates
}


export default {
    name: 'post-management',
    data () {
        return {
            name: 'post',
            columns: [
                { type: 'selection', width: 40, align: 'center' },
                { title: '#', key: 'id', sortable: true, width: 70 },
                { title: '标题', key: 'post_title', sortable: true, render: renderTitle.bind(this), minWidth: 200 },
                { title: '作者', key: 'post_author', sortable: true, width: 220, render: renderAuthor.bind(this) },
                { title: '类别', key: 'category', width: 120, render: renderCategory.bind(this) },
                { title: '标签', key: 'tags', width: 210, render: renderTags.bind(this) }, // 标签的筛选在表格中做很麻烦，因为这个标签列表是动态的
                { title: '评论', key: 'comment', width: 80 },
                { title: '日期', key: 'updatedAt', width: 220, render: renderDate.bind(this), sortable: 'custom' }
            ],
            formItem: { key: '', category: 'all', status: 'all' },
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
            data: state => state.data.posts,
            categoryList: state => state.data.categoryList,
            postStatusDict: state => state.dict.postStatus
        }),
        filterData () {
            let { key, category: categoryId, status } = this.formItem
            let tmpData = this.data
            if (key) {
                tmpData = filter(tmpData, (item) => item.post_title.indexOf(key) > -1)
            }
            if (categoryId && categoryId !== 'all') {
                tmpData = filter(tmpData, (item) => {
                    let category = find(item.terms, ['taxonomy', 'category'])
                    return category.id === categoryId
                })
            }
            if (status && status !== 'all') {
                tmpData = filter(tmpData, (item) => item.post_status === status)
            }
            return tmpData
        }
        // selectedNum: function () {
        //     return this.selectedList.length
        // },
    },
    methods: {
        ...mapActions({
            'fetchPosts': 'fetchPosts',
            'fetchTerms': 'fetchTerms',
            'trash': 'deletePost',
            'updatePostsCategoryByPostId': 'updatePostsCategoryByPostId'
            // 'trash': 'trashPosts'
        }),
        sortMethod (column, key, order) {

            return []
            // if (key) {
            //
            // }
            // console.log(form)
        },
        newPost () {
            this.$router.push({ name: 'post_writer', query: { active: 'new' } })
        },
        async $handleChangePostCategory (row, v) {
            try {
                let { id } = row
                await this.updatePostsCategoryByPostId({ postId: id, category: v })
                row._editCategory = false
                this.$Message.success(this.$t('messages.curd.update_success'))
            } catch (e) {
                this.$Message.error(this.$t('messages.curd.update_fail', e))
                // } finally {

            }

        }
        // handleSelectChange (value) {
        //     this.selectedList = value
        // },
    },
    created () {
        this.fetchTerms(false)
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
